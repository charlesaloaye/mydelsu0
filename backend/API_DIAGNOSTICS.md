# API Diagnostics Guide

## Issue: HTML Response Instead of JSON

If you're receiving HTML instead of JSON from API endpoints (e.g., `https://api.gen6ixx.com/api/referrals/stats`), check the following:

## 1. Check Authentication Token

The `/api/referrals/stats` endpoint is protected and requires authentication.

**Ensure you're sending the Authorization header:**

```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Test with curl:**

```bash
curl -X GET "https://api.gen6ixx.com/api/referrals/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json" \
  -v
```

## 2. Check Server Configuration

### Nginx Configuration

Ensure your Nginx server block is properly configured:

```nginx
server {
    listen 443 ssl http2;
    server_name api.gen6ixx.com;

    root /path/to/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;

        # Ensure API routes return JSON
        fastcgi_param HTTP_ACCEPT application/json;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Apache Configuration (.htaccess)

Ensure your `.htaccess` in the `public` directory is configured:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

## 3. Check Laravel Route

Verify the route exists and is accessible:

```bash
# From backend directory
php artisan route:list | grep referrals
```

Expected output should include:

```
GET|HEAD  api/referrals/stats ... UserController@referralStats
```

## 4. Test API Endpoint Directly

### With Authentication Token

```bash
# Replace YOUR_TOKEN with actual token
curl -X GET "https://api.gen6ixx.com/api/referrals/stats" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

### Expected Response (200 OK):

```json
{
  "success": true,
  "data": {
    "total_referrals": 5,
    "verified_referrals": 3,
    "total_earnings": 1500,
    "referral_code": "ABC123",
    "referral_link": "https://gen6ixx.com/register?ref=1234567890"
  }
}
```

### Without Authentication Token (401 Unauthorized):

```json
{
  "success": false,
  "message": "Unauthenticated. Please provide a valid authentication token.",
  "error": "Unauthenticated"
}
```

## 5. Common Issues and Solutions

### Issue: HTML Error Page (404, 500, etc.)

**Possible causes:**

- Server (Nginx/Apache) is returning default error pages
- Laravel application not properly configured
- Route not matching

**Solutions:**

1. Check server error logs:

   ```bash
   # Nginx
   tail -f /var/log/nginx/error.log

   # Apache
   tail -f /var/log/apache2/error.log
   ```

2. Check Laravel logs:

   ```bash
   tail -f storage/logs/laravel.log
   ```

3. Verify Laravel is accessible:
   ```bash
   curl -X GET "https://api.gen6ixx.com/api/"
   ```
   Should return:
   ```json
   {
     "message": "Welcome to myDelsu API",
     "version": "1.0.0"
   }
   ```

### Issue: CORS Errors

If you see CORS errors in browser console:

1. Verify `api.gen6ixx.com` is in allowed origins in `config/cors.php`
2. Clear config cache:
   ```bash
   php artisan config:clear
   ```
3. Restart web server if needed

### Issue: Route Not Found (404)

1. Clear route cache:

   ```bash
   php artisan route:clear
   php artisan cache:clear
   ```

2. Check route exists:

   ```bash
   php artisan route:list | grep referrals
   ```

3. Verify URL format: `https://api.gen6ixx.com/api/referrals/stats`
   - Note: The `/api` prefix is required

### Issue: Invalid Token (401)

1. Verify token is valid:

   - Token should be obtained from `/api/login` endpoint
   - Token format: `Bearer YOUR_TOKEN_HERE`

2. Check token expiration:

   - Sanctum tokens don't expire by default
   - If using custom expiration, verify token hasn't expired

3. Verify user exists and is authenticated:
   ```bash
   curl -X GET "https://api.gen6ixx.com/api/user" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json"
   ```

## 6. Debug Steps

### Step 1: Test Public Endpoint

```bash
curl -X GET "https://api.gen6ixx.com/api/"
```

### Step 2: Test Authentication

```bash
curl -X POST "https://api.gen6ixx.com/api/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email_or_phone": "your_email@example.com",
    "password": "your_password"
  }'
```

### Step 3: Use Token to Access Protected Endpoint

```bash
# Use token from Step 2
curl -X GET "https://api.gen6ixx.com/api/referrals/stats" \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2" \
  -H "Accept: application/json"
```

## 7. Production Checklist

- [ ] Server is running and accessible
- [ ] SSL certificate is valid
- [ ] Nginx/Apache is properly configured
- [ ] Laravel application is deployed correctly
- [ ] `.env` file is configured with correct values
- [ ] Database connection is working
- [ ] Cache and config are cleared: `php artisan config:clear && php artisan cache:clear`
- [ ] Routes are cached (production): `php artisan route:cache`
- [ ] CORS is configured for your frontend domain
- [ ] Authentication tokens are being sent correctly

## 8. Environment Variables

Ensure these are set in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.gen6ixx.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=gen6ixx.com,www.gen6ixx.com
SESSION_DOMAIN=.gen6ixx.com
```

## 9. Contact Information

If issues persist:

1. Check server logs
2. Check Laravel logs (`storage/logs/laravel.log`)
3. Verify server configuration
4. Test with curl commands above
