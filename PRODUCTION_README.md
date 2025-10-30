# Production Deployment Guide

This document outlines what needs to be configured for production deployment.

## ✅ Production-Ready Components

### Backend (Laravel)
- ✅ API routes are properly configured
- ✅ Authentication (Sanctum) is set up
- ✅ CORS configuration updated for production domains
- ✅ Database migrations ready
- ✅ Models and controllers implemented

### Frontend (Next.js)
- ✅ API client uses environment variables
- ✅ Hardcoded localhost URLs replaced with environment variables
- ✅ Error handling for API responses
- ✅ Authentication token management
- ✅ Image URL construction uses environment variables

## 🔧 Required Production Configuration

### Frontend Environment Variables

Create a `.env.production` file or set environment variables in your hosting platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_API_URL=https://api.gen6ixx.com/api
```

**Important:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser.

### Backend Environment Variables

Set these in your Laravel backend `.env` file:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.gen6ixx.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Sanctum/CORS
SANCTUM_STATEFUL_DOMAINS=mydelsu.com,www.mydelsu.com,gen6ixx.com,www.gen6ixx.com

# Mail Configuration (if using email)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@mydelsu.com
MAIL_FROM_NAME="${APP_NAME}"

# Other services (Paystack, etc.)
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
```

### CORS Configuration

The CORS configuration in `backend/config/cors.php` has been updated to include:
- `https://gen6ixx.com`
- `https://www.gen6ixx.com`
- `https://mydelsu.com`
- `https://www.mydelsu.com`
- Existing Vercel deployment URLs

If you deploy to a new domain, add it to the `allowed_origins` array.

## 🚀 Deployment Checklist

### Backend Deployment

1. **Server Requirements**
   - PHP 8.1 or higher
   - Composer
   - Node.js & NPM (for asset compilation)
   - MySQL/PostgreSQL database

2. **Pre-deployment Steps**
   ```bash
   cd backend
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan migrate --force
   ```

3. **Post-deployment Steps**
   - Set proper file permissions for `storage/` and `bootstrap/cache/`
   - Configure web server (Nginx/Apache) to point to `public/` directory
   - Set up SSL certificate (Let's Encrypt recommended)
   - Configure queue workers if using queues
   - Set up scheduled tasks (cron) for Laravel scheduler

4. **Web Server Configuration (Nginx Example)**
   ```nginx
   server {
       listen 80;
       server_name api.gen6ixx.com;
       root /path/to/backend/public;
       
       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-Content-Type-Options "nosniff";
       
       index index.php;
       
       charset utf-8;
       
       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }
       
       location = /favicon.ico { access_log off; log_not_found off; }
       location = /robots.txt  { access_log off; log_not_found off; }
       
       error_page 404 /index.php;
       
       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }
       
       location ~ /\.(?!well-known).* {
           deny all;
       }
   }
   ```

### Frontend Deployment

1. **Vercel Deployment** (Recommended)
   - Connect your GitHub repository
   - Set environment variable: `NEXT_PUBLIC_API_URL=https://api.gen6ixx.com/api`
   - Deploy

2. **Other Platforms**
   - Build the app: `npm run build`
   - Set `NEXT_PUBLIC_API_URL` environment variable
   - Deploy the `.next` output directory

3. **Domain Configuration**
   - Point your custom domain (e.g., `mydelsu.com`) to your frontend deployment
   - Ensure SSL/HTTPS is enabled

## 🔍 Troubleshooting

### Issue: API returns HTML instead of JSON

**Possible Causes:**
1. Backend server not running
2. Incorrect API URL in frontend environment variable
3. Web server (Nginx/Apache) routing misconfiguration
4. Missing authentication token
5. CORS blocking the request

**Solutions:**
1. Verify backend is running: `curl https://api.gen6ixx.com/api/`
2. Check `NEXT_PUBLIC_API_URL` is set correctly
3. Verify web server configuration points to Laravel `public/` directory
4. Ensure authentication token is stored and sent with requests
5. Check CORS configuration includes your frontend domain

### Issue: Images not loading

**Possible Causes:**
1. Backend storage not properly configured
2. Incorrect file permissions
3. Image URLs using localhost instead of production URL

**Solutions:**
1. Ensure `storage/app/public` is linked: `php artisan storage:link`
2. Set proper permissions: `chmod -R 775 storage bootstrap/cache`
3. Verify `NEXT_PUBLIC_API_URL` is set correctly (all hardcoded localhost URLs have been replaced)

### Issue: CORS errors

**Solution:**
1. Add your frontend domain to `backend/config/cors.php` `allowed_origins` array
2. Clear config cache: `php artisan config:clear`
3. Ensure `supports_credentials` is set correctly if using cookies

## 📝 Additional Notes

### Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Store all API keys in environment variables, not in code
3. **Debug Mode**: Always set `APP_DEBUG=false` in production
4. **HTTPS**: Always use HTTPS in production
5. **Database**: Use strong passwords and limit database access

### Performance Optimization

1. **Backend**:
   - Enable OPcache
   - Use Redis for caching and sessions
   - Configure queue workers for background jobs
   - Use CDN for static assets

2. **Frontend**:
   - Next.js automatically optimizes images
   - Enable compression in hosting platform
   - Use CDN for static assets

### Monitoring

Set up monitoring for:
- API response times
- Error rates
- Database performance
- Server resource usage

## ✅ Pre-Production Verification

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] API endpoints return JSON (not HTML)
- [ ] Authentication works end-to-end
- [ ] Images load correctly
- [ ] CORS is configured for your frontend domain
- [ ] SSL/HTTPS is enabled
- [ ] Error pages are configured
- [ ] Database backups are set up
- [ ] Logging is configured
- [ ] Rate limiting is enabled (if applicable)

## 📞 Support

If you encounter issues not covered here, check:
1. Laravel logs: `backend/storage/logs/laravel.log`
2. Web server error logs
3. Browser console for frontend errors
4. Network tab in browser DevTools for API request/response details

