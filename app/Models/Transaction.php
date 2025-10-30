<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'status',
        'description',
        'reference',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
