# Redis Caching Setup

This document describes how Redis caching is configured for the Laravel backend API.

## Overview

Redis is used as the default cache driver to improve API response times and reduce database load. Frequently accessed endpoints are cached with appropriate TTL (Time To Live) values.

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
CACHE_STORE=redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1
REDIS_PREFIX=mydelsu_database_
```

### Production Setup

For production environments, update these values:

```env
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379
REDIS_CACHE_DB=1
```

## Installation

### Local Development

1. **Install Redis** (if not already installed):

   **macOS:**

   ```bash
   brew install redis
   brew services start redis
   ```

   **Ubuntu/Debian:**

   ```bash
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   ```

   **Windows:**

   - Download from: https://github.com/microsoftarchive/redis/releases
   - Or use WSL2 with Ubuntu installation

2. **Install PHP Redis Extension:**

   **Using PECL:**

   ```bash
   pecl install redis
   ```

   **Using Homebrew (macOS):**

   ```bash
   brew install php-redis
   ```

3. **Verify Redis Connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

### Production (Server)

1. Install Redis on your server:

   ```bash
   sudo apt-get update
   sudo apt-get install redis-server
   sudo systemctl enable redis-server
   sudo systemctl start redis-server
   ```

2. Configure Redis for production:

   - Edit `/etc/redis/redis.conf`
   - Set `bind 127.0.0.1` or your server IP
   - Set `requirepass your-strong-password`
   - Restart Redis: `sudo systemctl restart redis-server`

3. Configure firewall (if needed):
   ```bash
   sudo ufw allow 6379/tcp
   ```

## Caching Strategy

### Cache Duration (TTL)

Different endpoints use different cache durations based on data volatility:

- **Dashboard Data**: 5 minutes (300 seconds)
- **Dashboard Stats**: 5 minutes (300 seconds)
- **Dashboard Announcements**: 10 minutes (600 seconds)
- **Marketplace Listings**: 10 minutes (600 seconds)
- **Marketplace Item Details**: 15 minutes (900 seconds)
- **Announcements List**: 10 minutes (600 seconds)
- **Recent Announcements**: 10 minutes (600 seconds)

### Cache Keys

Cache keys follow these patterns:

- User-specific: `prefix:user:{user_id}:{params_hash}`
- Request-specific: `prefix:{params_hash}:page:{page_number}`
- Item-specific: `prefix:show:{item_id}`

Examples:

- `dashboard:index:user:123`
- `marketplace:index:abc123def:page:1`
- `announcements:recent:user:456`

### Cache Invalidation

Cache is automatically cleared when:

- Marketplace items are created, updated, or deleted
- Announcements are created, updated, or deleted
- User-specific data changes (user-based cache keys ensure isolation)

## Usage in Controllers

### Using the Caching Trait

Controllers can use the `HasCacheableResponses` trait for caching:

```php
use App\Http\Controllers\Api\Traits\HasCacheableResponses;

class YourController extends Controller
{
    use HasCacheableResponses;

    public function index(Request $request)
    {
        $cacheKey = $this->getRequestCacheKey('your:prefix', $request);

        $data = $this->remember($cacheKey, function () use ($request) {
            // Your data fetching logic here
            return $results;
        }, 600); // 10 minutes cache

        return response()->json(['success' => true, 'data' => $data]);
    }
}
```

### Helper Methods

- `remember($key, $callback, $ttl)` - Cache data with TTL
- `getUserCacheKey($prefix, $userId, $params)` - Generate user-specific cache key
- `getRequestCacheKey($prefix, $request)` - Generate request-specific cache key

## Cache Management

### Clearing Cache

**Clear all cache:**

```bash
php artisan cache:clear
```

**Via Redis CLI:**

```bash
redis-cli FLUSHALL
```

**Programmatically:**

```php
use Illuminate\Support\Facades\Cache;
Cache::flush();
```

### View Cache Statistics

**Redis CLI:**

```bash
redis-cli INFO stats
```

### Monitor Cache Operations

**Redis CLI:**

```bash
redis-cli MONITOR
```

## Performance Considerations

1. **Memory Management**: Monitor Redis memory usage:

   ```bash
   redis-cli INFO memory
   ```

2. **TTL Settings**: Adjust cache TTL based on:

   - Data update frequency
   - User expectations for freshness
   - Database load

3. **Cache Warming**: For critical endpoints, consider pre-warming cache on deployment.

4. **Cache Tags** (Optional): For more granular invalidation, consider using cache tags (requires Redis 3.0+):
   ```php
   Cache::tags(['marketplace', 'user:123'])->put($key, $value, $ttl);
   ```

## Troubleshooting

### Redis Connection Issues

1. **Check Redis is running:**

   ```bash
   sudo systemctl status redis
   ```

2. **Test connection:**

   ```bash
   redis-cli ping
   ```

3. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

### Cache Not Working

1. Verify `CACHE_STORE=redis` in `.env`
2. Clear config cache: `php artisan config:clear`
3. Verify Redis extension is loaded: `php -m | grep redis`
4. Check Redis connection in `config/database.php`

### High Memory Usage

1. Reduce cache TTL values
2. Implement cache size limits in Redis config
3. Use Redis eviction policies (`maxmemory-policy`)

## Production Recommendations

1. **Use Redis Sentinel or Cluster** for high availability
2. **Enable Redis Persistence** (AOF or RDB) for data safety
3. **Monitor Redis Metrics** (memory, connections, operations/sec)
4. **Set Appropriate Memory Limits** with eviction policies
5. **Use Separate Redis Instances** for cache vs. session storage
6. **Implement Cache Warming** for critical endpoints

## Additional Resources

- [Laravel Caching Documentation](https://laravel.com/docs/cache)
- [Redis Documentation](https://redis.io/documentation)
- [PHPRedis Extension](https://github.com/phpredis/phpredis)
