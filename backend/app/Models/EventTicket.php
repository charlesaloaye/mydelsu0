<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EventTicket extends Model
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
        'event_id',
        'name',
        'price',
        'description',
        'benefits',
        'limited',
        'slots_left',
        'sold',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'benefits' => 'array',
        'limited' => 'boolean',
        'slots_left' => 'integer',
        'sold' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the event that owns the ticket.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute()
    {
        if ($this->price == 0) {
            return 'FREE';
        }
        return '₦' . number_format($this->price, 2);
    }

    /**
     * Get total revenue for this ticket.
     */
    public function getTotalRevenueAttribute()
    {
        return $this->price * $this->sold;
    }
}
