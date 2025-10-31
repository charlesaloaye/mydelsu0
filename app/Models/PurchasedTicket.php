<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PurchasedTicket extends Model
{
    use HasFactory;

    protected $table = 'user_purchased_tickets';

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
            if (empty($model->ticket_code)) {
                $model->ticket_code = 'TKT-' . strtoupper(Str::random(10));
            }
        });
    }

    protected $fillable = [
        'user_id',
        'event_id',
        'ticket_id',
        'price_paid',
        'quantity',
        'total_amount',
        'ticket_code',
        'status',
        'transaction_id',
    ];

    protected $casts = [
        'price_paid' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that purchased the ticket.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event for this ticket.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the ticket type.
     */
    public function ticket()
    {
        return $this->belongsTo(EventTicket::class, 'ticket_id');
    }

    /**
     * Get the transaction record.
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
