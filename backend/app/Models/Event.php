<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'date',
        'time',
        'location',
        'images',
        'tags',
        'status',
        'sponsored',
        'views',
        'interested',
        'tickets_sold',
        'revenue',
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'date' => 'date',
        'sponsored' => 'boolean',
        'views' => 'integer',
        'interested' => 'integer',
        'tickets_sold' => 'integer',
        'revenue' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the event.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tickets for the event.
     */
    public function tickets()
    {
        return $this->hasMany(EventTicket::class);
    }

    /**
     * Scope a query to only include upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming');
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search by title or description.
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%{$searchTerm}%")
                ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }

    /**
     * Get formatted revenue.
     */
    public function getFormattedRevenueAttribute()
    {
        return '₦' . number_format($this->revenue, 2);
    }

    /**
     * Get the first image or placeholder.
     */
    public function getFirstImageAttribute()
    {
        if (!empty($this->images) && is_array($this->images)) {
            return count($this->images) > 0 ? $this->images[0] : null;
        }

        return null;
    }

    /**
     * Increment views count.
     */
    public function incrementViews()
    {
        $this->increment('views');
    }
}
