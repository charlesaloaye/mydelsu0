<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Solution extends Model
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
        'past_question_id',
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
        'status',
        'admin_notes',
        'rating',
        'rating_count',
        'view_count',
        'download_count',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'rating_count' => 'integer',
        'view_count' => 'integer',
        'download_count' => 'integer',
        'file_size' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pastQuestion(): BelongsTo
    {
        return $this->belongsTo(PastQuestion::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(SolutionComment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(SolutionReview::class);
    }
}
