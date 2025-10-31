<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'content',
        'type',
        'priority',
        'target_audience',
        'department',
        'level',
        'is_active',
        'is_pinned',
        'publish_at',
        'expires_at',
        'image_url',
        'attachments',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_pinned' => 'boolean',
        'publish_at' => 'datetime',
        'expires_at' => 'datetime',
        'attachments' => 'array',
    ];

    /**
     * Get the user who created the announcement
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for active announcements
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for published announcements
     */
    public function scopePublished($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('publish_at')
                ->orWhere('publish_at', '<=', now());
        });
    }

    /**
     * Scope for non-expired announcements
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Scope for pinned announcements
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Scope for announcements by target audience
     */
    public function scopeForAudience($query, $audience, $department = null, $level = null)
    {
        return $query->where(function ($q) use ($audience, $department, $level) {
            $q->where('target_audience', 'all')
                ->orWhere('target_audience', $audience);

            if ($audience === 'specific_department' && $department) {
                $q->orWhere(function ($subQ) use ($department, $level) {
                    $subQ->where('target_audience', 'specific_department')
                        ->where('department', $department);

                    if ($level) {
                        $subQ->where(function ($levelQ) use ($level) {
                            $levelQ->whereNull('level')
                                ->orWhere('level', $level);
                        });
                    }
                });
            }
        });
    }

    /**
     * Get formatted date
     */
    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    /**
     * Get time ago
     */
    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Check if announcement is urgent
     */
    public function getIsUrgentAttribute()
    {
        return $this->priority === 'urgent';
    }

    /**
     * Check if announcement is high priority
     */
    public function getIsHighPriorityAttribute()
    {
        return in_array($this->priority, ['high', 'urgent']);
    }

    /**
     * Get priority color class
     */
    public function getPriorityColorAttribute()
    {
        return match ($this->priority) {
            'urgent' => 'red',
            'high' => 'orange',
            'medium' => 'blue',
            'low' => 'gray',
            default => 'blue'
        };
    }

    /**
     * Get type color class
     */
    public function getTypeColorAttribute()
    {
        return match ($this->type) {
            'important' => 'red',
            'warning' => 'yellow',
            'success' => 'green',
            'info' => 'blue',
            default => 'blue'
        };
    }
}
