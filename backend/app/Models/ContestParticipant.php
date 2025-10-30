<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContestParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\ContestParticipantFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'status']; // pending, approved

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
