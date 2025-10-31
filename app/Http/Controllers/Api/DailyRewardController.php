<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyReward;
use App\Models\Transaction;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DailyRewardController extends Controller
{
    /**
     * Claim daily reward
     */
    public function claim(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        // Check if user already claimed today
        if (DailyReward::hasClaimedToday($user->id, $today)) {
            return response()->json([
                'success' => false,
                'message' => 'You have already claimed your daily reward today'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Get current streak
            $streak = DailyReward::getStreak($user->id);

            // Calculate reward amount based on streak
            $rewardAmount = DailyReward::calculateRewardAmount($streak);

            // Add reward to wallet
            $user->increment('wallet_balance', $rewardAmount);

            // Create daily reward record
            $dailyReward = DailyReward::create([
                'user_id' => $user->id,
                'reward_date' => $today,
                'amount' => $rewardAmount,
                'reward_type' => 'daily',
                'streak_count' => $streak + 1,
                'claimed' => true,
                'claimed_at' => now()
            ]);

            // Create transaction record
            $description = $streak > 0 ? "Daily reward (Streak: " . ($streak + 1) . " days)" : 'Daily reward';
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'amount' => $rewardAmount,
                'description' => $description,
                'status' => 'completed',
                'reference' => 'DAILY_REWARD_' . time() . '_' . $user->id
            ]);

            // Create notification
            $streakMessage = $streak > 0 ? " (Day " . ($streak + 1) . " streak!)" : "";
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Daily Reward Claimed!',
                'message' => "You've earned ₦" . $rewardAmount . " from your daily reward" . $streakMessage,
                'type' => 'success',
                'data' => [
                    'type' => 'daily_reward',
                    'amount' => $rewardAmount,
                    'streak' => $streak + 1,
                    'daily_reward_id' => $dailyReward->id,
                    'base_amount' => 10.00,
                    'bonus_multiplier' => $streak >= 7 ? 2.0 : ($streak >= 3 ? 1.5 : 1.0)
                ],
                'is_read' => false
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Daily reward claimed successfully!',
                'data' => [
                    'reward_amount' => $rewardAmount,
                    'new_balance' => $user->fresh()->wallet_balance,
                    'streak' => $streak + 1,
                    'next_claim' => $today->addDay()->toDateString(),
                    'bonus_info' => $streak >= 7 ? 'Double reward for 7+ day streak!' : ($streak >= 3 ? '50% bonus for 3+ day streak!' : null)
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Failed to claim daily reward. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get daily reward status
     */
    public function status(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        $hasClaimedToday = DailyReward::hasClaimedToday($user->id, $today);
        $streak = DailyReward::getStreak($user->id);
        $lastClaimDate = DailyReward::getLastClaimDate($user->id);
        $nextRewardAmount = DailyReward::calculateRewardAmount($streak);

        return response()->json([
            'success' => true,
            'data' => [
                'has_claimed_today' => $hasClaimedToday,
                'current_streak' => $streak,
                'last_claim_date' => $lastClaimDate?->toDateString(),
                'next_reward_amount' => $nextRewardAmount,
                'next_claim_date' => $today->addDay()->toDateString(),
                'streak_bonus' => [
                    '3_days' => '50% bonus',
                    '7_days' => '100% bonus (double reward)'
                ]
            ]
        ]);
    }

    /**
     * Get daily reward history
     */
    public function history(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 20);

        $rewards = DailyReward::where('user_id', $user->id)
            ->orderBy('reward_date', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $rewards
        ]);
    }

    /**
     * Get streak statistics
     */
    public function streakStats(Request $request)
    {
        $user = $request->user();

        $totalRewards = DailyReward::where('user_id', $user->id)
            ->where('claimed', true)
            ->count();

        $totalEarned = DailyReward::where('user_id', $user->id)
            ->where('claimed', true)
            ->sum('amount');

        $currentStreak = DailyReward::getStreak($user->id);

        $longestStreak = $this->calculateLongestStreak($user->id);

        return response()->json([
            'success' => true,
            'data' => [
                'total_rewards_claimed' => $totalRewards,
                'total_amount_earned' => $totalEarned,
                'current_streak' => $currentStreak,
                'longest_streak' => $longestStreak,
                'average_daily_earnings' => $totalRewards > 0 ? round($totalEarned / $totalRewards, 2) : 0
            ]
        ]);
    }

    /**
     * Calculate longest streak for user
     */
    private function calculateLongestStreak($userId): int
    {
        $rewards = DailyReward::where('user_id', $userId)
            ->where('claimed', true)
            ->orderBy('reward_date', 'asc')
            ->get();

        if ($rewards->isEmpty()) {
            return 0;
        }

        $longestStreak = 0;
        $currentStreak = 0;
        $lastDate = null;

        foreach ($rewards as $reward) {
            if ($lastDate === null || $reward->reward_date->diffInDays($lastDate) === 1) {
                $currentStreak++;
            } else {
                $longestStreak = max($longestStreak, $currentStreak);
                $currentStreak = 1;
            }
            $lastDate = $reward->reward_date;
        }

        return max($longestStreak, $currentStreak);
    }
}
