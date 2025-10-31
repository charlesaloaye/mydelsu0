<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PastQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'course_code',
        'course_title',
        'level',
        'semester',
        'session',
        'department',
        'description',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'price',
        'status',
        'admin_notes',
        'download_count',
        'view_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'file_size' => 'integer',
        'download_count' => 'integer',
        'view_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
