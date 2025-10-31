<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolutionComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'solution_id',
        'user_id',
        'comment',
        'helpful_count',
    ];

    protected $casts = [
        'helpful_count' => 'integer',
    ];

    public function solution(): BelongsTo
    {
        return $this->belongsTo(Solution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
