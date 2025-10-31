<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class DailyReward extends Model
{
    protected $fillable = [
        'user_id',
        'reward_date',
        'amount',
        'reward_type',
        'streak_count',
        'claimed',
        'claimed_at'
    ];

    protected $casts = [
        'reward_date' => 'date',
        'amount' => 'decimal:2',
        'claimed' => 'boolean',
        'claimed_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if user has claimed daily reward for a specific date
     */
    public static function hasClaimedToday($userId, $date = null): bool
    {
        $date = $date ? Carbon::parse($date) : Carbon::today();

        return self::where('user_id', $userId)
            ->whereDate('reward_date', $date)
            ->where('claimed', true)
            ->exists();
    }

    /**
     * Get user's daily reward streak
     */
    public static function getStreak($userId): int
    {
        $rewards = self::where('user_id', $userId)
            ->where('claimed', true)
            ->orderBy('reward_date', 'desc')
            ->get();

        if ($rewards->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $currentDate = Carbon::today();

        foreach ($rewards as $reward) {
            if ($reward->reward_date->isSameDay($currentDate)) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Get last claim date for user
     */
    public static function getLastClaimDate($userId): ?Carbon
    {
        $lastReward = self::where('user_id', $userId)
            ->where('claimed', true)
            ->orderBy('reward_date', 'desc')
            ->first();

        return $lastReward ? $lastReward->reward_date : null;
    }

    /**
     * Calculate reward amount based on streak
     */
    public static function calculateRewardAmount($streak = 0): float
    {
        $baseAmount = 10.00;

        // Bonus for streaks
        if ($streak >= 7) {
            return $baseAmount * 2; // Double reward for 7+ day streak
        } elseif ($streak >= 3) {
            return $baseAmount * 1.5; // 50% bonus for 3+ day streak
        }

        return $baseAmount;
    }
}
