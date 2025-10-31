<?php

namespace App\Http\Controllers\Api\Traits;

use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

trait HasCacheableResponses
{
    /**
     * Get cached data or store it if not exists
     *
     * @param string $key Cache key
     * @param callable $callback Callback to generate data if cache miss
     * @param int $ttl Time to live in seconds (default: 60 minutes)
     * @return mixed
     */
    protected function remember(string $key, callable $callback, int $ttl = 3600)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Get cache key for user-specific data
     *
     * @param string $prefix Key prefix
     * @param int|null $userId User ID
     * @param array $params Additional parameters
     * @return string
     */
    protected function getUserCacheKey(string $prefix, ?int $userId = null, array $params = []): string
    {
        $key = $prefix;
        if ($userId) {
            $key .= ":user:{$userId}";
        }
        if (!empty($params)) {
            $key .= ':' . md5(serialize($params));
        }
        return $key;
    }

    /**
     * Get cache key for request-specific data
     *
     * @param string $prefix Key prefix
     * @param \Illuminate\Http\Request $request Request object
     * @return string
     */
    protected function getRequestCacheKey(string $prefix, $request): string
    {
        $params = $request->only([
            'category',
            'search',
            'min_price',
            'max_price',
            'sort_by',
            'type',
            'level',
            'department',
            'priority',
            'per_page',
            'page'
        ]);

        // Filter out empty/null values
        $params = array_filter($params, function ($value) {
            return $value !== null && $value !== '';
        });

        $key = $prefix;
        if (!empty($params)) {
            $key .= ':' . md5(serialize($params));
        }
        return $key;
    }

    /**
     * Invalidate cache by pattern
     *
     * @param string $pattern Cache key pattern (supports wildcards)
     * @return void
     */
    protected function invalidateCache(string $pattern): void
    {
        // Note: Laravel Cache doesn't support wildcard deletion natively
        // For Redis, you would need to use Redis facade directly
        // This is a simplified version - in production, consider using tags if supported
        Cache::forget($pattern);
    }

    /**
     * Clear all cache for a specific prefix
     *
     * @param string $prefix Cache key prefix
     * @return void
     */
    protected function clearCacheByPrefix(string $prefix): void
    {
        // This would require Redis-specific implementation
        // For now, we'll use a simple approach
        Cache::flush();
    }
}
