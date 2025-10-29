<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $unreadCount
            ]
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = Notification::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    /**
     * Create a notification (for internal use)
     */
    public static function create($userId, $title, $message, $type = 'info', $data = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => $data ? json_encode($data) : null,
            'is_read' => false
        ]);
    }

    /**
     * Create notification for referral bonus
     */
    public static function createReferralBonus($userId, $referralName, $amount)
    {
        return self::create(
            $userId,
            'Referral Bonus Earned!',
            "Your referral {$referralName} just activated their account! ₦{$amount} has been added to your wallet.",
            'success',
            [
                'type' => 'referral_bonus',
                'amount' => $amount,
                'referral_name' => $referralName
            ]
        );
    }

    /**
     * Create notification for transaction
     */
    public static function createTransaction($userId, $type, $amount, $description)
    {
        $title = $type === 'credit' ? 'Money Received' : 'Payment Made';
        $message = $type === 'credit'
            ? "₦{$amount} has been credited to your wallet. {$description}"
            : "₦{$amount} has been debited from your wallet. {$description}";

        return self::create(
            $userId,
            $title,
            $message,
            $type === 'credit' ? 'success' : 'info',
            [
                'type' => 'transaction',
                'transaction_type' => $type,
                'amount' => $amount,
                'description' => $description
            ]
        );
    }

    /**
     * Create notification for verification
     */
    public static function createVerification($userId, $status, $message = null)
    {
        $title = $status === 'approved' ? 'Account Verified!' : 'Verification Update';
        $defaultMessage = $status === 'approved'
            ? 'Congratulations! Your account has been verified successfully.'
            : 'Your verification documents are being reviewed.';

        return self::create(
            $userId,
            $title,
            $message ?? $defaultMessage,
            $status === 'approved' ? 'success' : 'info',
            [
                'type' => 'verification',
                'status' => $status
            ]
        );
    }

    /**
     * Create notification for profile completion
     */
    public static function createProfileCompletion($userId, $percentage)
    {
        $title = 'Profile Completion Update';
        $message = "Your profile is {$percentage}% complete. " .
            ($percentage < 100 ? "Complete your profile to get verified!" : "Great job! Your profile is complete.");

        return self::create(
            $userId,
            $title,
            $message,
            $percentage >= 100 ? 'success' : 'info',
            [
                'type' => 'profile_completion',
                'percentage' => $percentage
            ]
        );
    }

    /**
     * Create notification for new content
     */
    public static function createNewContent($userId, $contentType, $title, $description)
    {
        return self::create(
            $userId,
            "New {$contentType} Available",
            "{$title} - {$description}",
            'info',
            [
                'type' => 'new_content',
                'content_type' => $contentType,
                'title' => $title,
                'description' => $description
            ]
        );
    }

    /**
     * Create notification for system maintenance
     */
    public static function createMaintenance($userId, $startTime, $endTime)
    {
        return self::create(
            $userId,
            'Scheduled Maintenance',
            "System maintenance is scheduled from {$startTime} to {$endTime}. Some features may be unavailable during this time.",
            'warning',
            [
                'type' => 'maintenance',
                'start_time' => $startTime,
                'end_time' => $endTime
            ]
        );
    }

    /**
     * Create notification for withdrawal
     */
    public static function createWithdrawal($userId, $amount, $status, $message = null)
    {
        $title = $status === 'completed' ? 'Withdrawal Successful' : 'Withdrawal Update';
        $defaultMessage = $status === 'completed'
            ? "Your withdrawal of ₦{$amount} has been processed successfully."
            : "Your withdrawal of ₦{$amount} is being processed.";

        return self::create(
            $userId,
            $title,
            $message ?? $defaultMessage,
            $status === 'completed' ? 'success' : 'info',
            [
                'type' => 'withdrawal',
                'amount' => $amount,
                'status' => $status
            ]
        );
    }
}
