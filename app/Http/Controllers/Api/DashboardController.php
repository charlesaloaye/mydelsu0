<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Traits\HasCacheableResponses;
use App\Models\User;
use App\Models\Transaction;
use App\Models\ReferralReward;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use HasCacheableResponses;
    /**
     * Get dashboard data
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Cache key includes user ID and timestamp (cache for 5 minutes)
        $cacheKey = $this->getUserCacheKey('dashboard:index', $user->id);

        $data = $this->remember($cacheKey, function () use ($user) {
            // Get wallet stats
            $walletStats = $this->getWalletStats($user);

            // Get recent transactions
            $recentTransactions = Transaction::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // Get announcements
            $announcements = $this->getAnnouncements($user);

            // Get user stats
            $userStats = $this->getUserStats($user);

            return [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'is_verified' => $user->is_verified,
                    'profile_complete' => $user->profile_complete,
                    'avatar' => $user->avatar
                ],
                'wallet' => $walletStats,
                'recent_transactions' => $recentTransactions,
                'announcements' => $announcements,
                'user_stats' => $userStats
            ];
        }, 300); // 5 minutes cache

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        // Cache stats for 5 minutes
        $cacheKey = $this->getUserCacheKey('dashboard:stats', $user->id);

        $stats = $this->remember($cacheKey, function () use ($user) {
            return [
                'wallet' => $this->getWalletStats($user),
                'referrals' => $this->getReferralStats($user),
                'transactions' => $this->getTransactionStats($user),
                'profile' => $this->getProfileStats($user)
            ];
        }, 300); // 5 minutes cache

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get announcements
     */
    public function announcements(Request $request)
    {
        // Cache announcements for 10 minutes (they don't change frequently)
        $cacheKey = 'dashboard:announcements';

        $announcements = $this->remember($cacheKey, function () {
            return $this->getAnnouncements();
        }, 600); // 10 minutes cache

        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    /**
     * Get wallet statistics
     */
    private function getWalletStats($user)
    {
        $availableBalance = $user->wallet_balance ?? 0;
        $pendingBalance = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');

        $totalEarned = Transaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->where('status', 'completed')
            ->sum('amount');

        $totalSpent = Transaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->where('status', 'completed')
            ->sum('amount');

        return [
            'available_balance' => $availableBalance,
            'pending_balance' => $pendingBalance,
            'total_earned' => $totalEarned,
            'total_spent' => $totalSpent,
            'can_withdraw' => $availableBalance >= 2500,
            'currency' => '₦'
        ];
    }

    /**
     * Get referral statistics
     */
    private function getReferralStats($user)
    {
        $totalReferrals = User::where('referral_number', $user->whatsapp)->count();
        $verifiedReferrals = User::where('referral_number', $user->whatsapp)
            ->where('is_verified', true)
            ->count();

        $totalEarnings = ReferralReward::where('user_id', $user->id)
            ->where('is_paid', true)
            ->sum('amount');

        $thisMonthReferrals = User::where('referral_number', $user->whatsapp)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        return [
            'total_referrals' => $totalReferrals,
            'verified_referrals' => $verifiedReferrals,
            'total_earnings' => $totalEarnings,
            'this_month_referrals' => $thisMonthReferrals,
            'referral_code' => $user->referral_code
        ];
    }

    /**
     * Get transaction statistics
     */
    private function getTransactionStats($user)
    {
        $totalTransactions = Transaction::where('user_id', $user->id)->count();
        $thisMonthTransactions = Transaction::where('user_id', $user->id)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $successfulTransactions = Transaction::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $pendingTransactions = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        return [
            'total_transactions' => $totalTransactions,
            'this_month_transactions' => $thisMonthTransactions,
            'successful_transactions' => $successfulTransactions,
            'pending_transactions' => $pendingTransactions
        ];
    }

    /**
     * Get profile statistics
     */
    private function getProfileStats($user)
    {
        $profileComplete = $user->profile_complete ?? 0;
        $isVerified = $user->is_verified ?? false;
        $verificationStatus = $user->verification_status ?? 'not_submitted';

        $missingFields = [];
        if (empty($user->avatar)) $missingFields[] = 'avatar';
        if (empty($user->student_id_image)) $missingFields[] = 'student_id';
        if (!$user->is_verified) $missingFields[] = 'verification';

        return [
            'completion_percentage' => $profileComplete,
            'is_verified' => $isVerified,
            'verification_status' => $verificationStatus,
            'missing_fields' => $missingFields,
            'can_verify' => !empty($user->student_id_image) && $verificationStatus === 'not_submitted'
        ];
    }

    /**
     * Get user statistics
     */
    private function getUserStats($user)
    {
        $joinDate = $user->created_at;
        $daysSinceJoin = $joinDate->diffInDays(Carbon::now());

        $lastLogin = $user->last_login_at ?? $user->created_at;
        $daysSinceLastLogin = $lastLogin->diffInDays(Carbon::now());

        return [
            'member_since' => $joinDate->format('M Y'),
            'days_since_join' => $daysSinceJoin,
            'last_login' => $lastLogin->format('M d, Y'),
            'days_since_last_login' => $daysSinceLastLogin,
            'account_status' => $user->is_verified ? 'verified' : 'unverified'
        ];
    }

    /**
     * Get announcements data
     */
    private function getAnnouncements($user = null)
    {
        try {
            $query = Announcement::with('creator')
                ->active()
                ->published()
                ->notExpired()
                ->orderBy('is_pinned', 'desc')
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(5);

            // Filter by user's department and level if available
            if ($user) {
                $query->forAudience('all', $user->department, $user->level ?? null);
            }

            $announcements = $query->get();

            // If no announcements found, return some default ones
            if ($announcements->isEmpty()) {
                return [
                    [
                        'id' => 1,
                        'title' => 'Welcome to myDelsu',
                        'content' => 'Welcome to the myDelsu platform. Stay updated with the latest announcements and news.',
                        'date' => Carbon::now()->format('M d, Y'),
                        'type' => 'info',
                        'priority' => 'medium',
                        'is_pinned' => true,
                        'creator' => ['first_name' => 'Admin', 'last_name' => 'System']
                    ],
                    [
                        'id' => 2,
                        'title' => 'Platform Features',
                        'content' => 'Explore our features including GPA calculator, marketplace, past questions, and more.',
                        'date' => Carbon::now()->subDays(1)->format('M d, Y'),
                        'type' => 'info',
                        'priority' => 'low',
                        'is_pinned' => false,
                        'creator' => ['first_name' => 'Admin', 'last_name' => 'System']
                    ]
                ];
            }

            return $announcements->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'date' => $announcement->formatted_date,
                    'type' => $announcement->type,
                    'priority' => $announcement->priority,
                    'is_pinned' => $announcement->is_pinned,
                    'creator' => [
                        'first_name' => $announcement->creator->first_name ?? 'Admin',
                        'last_name' => $announcement->creator->last_name ?? 'System'
                    ]
                ];
            })->toArray();
        } catch (\Exception $e) {
            // Fallback to mock data if database query fails
            return [
                [
                    'id' => 1,
                    'title' => 'System Notice',
                    'content' => 'Welcome to myDelsu platform. Stay tuned for updates.',
                    'date' => Carbon::now()->format('M d, Y'),
                    'type' => 'info',
                    'priority' => 'medium',
                    'is_pinned' => true,
                    'creator' => ['first_name' => 'Admin', 'last_name' => 'System']
                ]
            ];
        }
    }
}
