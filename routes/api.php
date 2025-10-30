<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\GpaController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\ServicesController;
use App\Http\Controllers\Api\EventsController;
use App\Http\Controllers\Api\HostelsController;
use App\Http\Controllers\Api\RoommatesController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\DailyRewardController;
use App\Http\Controllers\Api\CourseSummariesController;
use App\Http\Controllers\Api\PastQuestionsController;
use App\Models\Course;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to myDelsu API',
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/data-plans', [WalletController::class, 'getDataPlans']);
Route::post('/paystack/initialize', [WalletController::class, 'initializePaystackPayment']);
Route::get('/paystack/verify', [WalletController::class, 'verifyPaystackTransaction']);

// Public marketplace routes (viewing products)
Route::get('/marketplace', [MarketplaceController::class, 'index']);
Route::get('/marketplace/{id}', [MarketplaceController::class, 'show']);

// Public services routes (viewing services)
Route::get('/services', [ServicesController::class, 'index']);
Route::get('/services/{id}', [ServicesController::class, 'show']);

// Public events routes (viewing events)
Route::get('/events', [EventsController::class, 'index']);
Route::get('/events/{id}', [EventsController::class, 'show']);

// Public hostels routes (viewing hostels)
Route::get('/hostels', [HostelsController::class, 'index']);
Route::get('/hostels/{id}', [HostelsController::class, 'show']);

// Public roommates routes (viewing roommate listings)
Route::get('/roommates', [RoommatesController::class, 'index']);
Route::get('/roommates/{id}', [RoommatesController::class, 'show']);

// Public course summaries routes (viewing course summaries)
Route::get('/course-summaries', [CourseSummariesController::class, 'index']);
Route::get('/course-summaries/{id}', [CourseSummariesController::class, 'show']);
Route::get('/course-summaries/{id}/download', [CourseSummariesController::class, 'download']);
Route::get('/course-summaries/stats', [CourseSummariesController::class, 'stats']);

// Public past questions routes (viewing past questions)
Route::get('/past-questions', [PastQuestionsController::class, 'index']);
Route::get('/past-questions/{id}', [PastQuestionsController::class, 'show']);
Route::get('/past-questions/{id}/download', [PastQuestionsController::class, 'download']);
Route::get('/past-questions/stats', [PastQuestionsController::class, 'stats']);

// Public courses route (for frontend getCourses)
Route::get('/courses', function (Request $request) {
    $query = Course::query();

    if ($request->has('department')) {
        $query->where('department', $request->department);
    }
    if ($request->has('level')) {
        $query->where('level', $request->level);
    }
    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
                ->orWhere('title', 'like', "%{$search}%");
        });
    }

    $courses = $query->orderBy('code')->limit(200)->get();

    return response()->json([
        'success' => true,
        'data' => $courses,
    ]);
});

// Public referral info (for registration by referral code/number)
Route::get('/referrals/info/{code}', [UserController::class, 'referrerInfo']);

// Public course summaries search (POST payload: { query, filters })
Route::post('/course-summaries/search', [CourseSummariesController::class, 'search']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // User management
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/upload-avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/profile/verify', [UserController::class, 'verifyProfile']);

    // Settings
    Route::put('/settings/notifications', [UserController::class, 'updateNotificationPreferences']);
    Route::put('/settings/privacy', [UserController::class, 'updatePrivacySettings']);
    Route::put('/settings/theme', [UserController::class, 'updateThemeSettings']);
    Route::post('/settings/deactivate-account', [UserController::class, 'deactivateAccount']);
    Route::delete('/settings/delete-account', [UserController::class, 'deleteAccount']);
    Route::get('/user/uploads', [UserController::class, 'getUserUploads']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/announcements', [DashboardController::class, 'announcements']);

    // Wallet
    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/fund', [WalletController::class, 'fund']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    Route::post('/wallet/buy-airtime', [WalletController::class, 'buyAirtime']);
    Route::post('/wallet/buy-data', [WalletController::class, 'buyData']);
    Route::post('/wallet/claim-daily-reward', [WalletController::class, 'claimDailyReward']); // Keep for backward compatibility

    // Daily Rewards
    Route::get('/daily-rewards/status', [DailyRewardController::class, 'status']);
    Route::post('/daily-rewards/claim', [DailyRewardController::class, 'claim']);
    Route::get('/daily-rewards/history', [DailyRewardController::class, 'history']);
    Route::get('/daily-rewards/streak-stats', [DailyRewardController::class, 'streakStats']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Uploads
    Route::post('/upload/question', [UploadController::class, 'uploadQuestion']);
    Route::post('/upload/project', [UploadController::class, 'uploadProject']);
    Route::post('/upload/hostel', [UploadController::class, 'uploadHostel']);

    // Referrals
    Route::get('/referrals', [UserController::class, 'referrals']);
    Route::get('/referrals/stats', [UserController::class, 'referralStats']);
    Route::post('/referrals/generate-link', [UserController::class, 'generateReferralLink']);
    // Subscription status
    Route::get('/user/subscription', [UserController::class, 'subscription']);

    // GPA Calculations
    Route::get('/gpa-calculations', [GpaController::class, 'index']);
    Route::post('/gpa-calculations', [GpaController::class, 'calculate']);
    Route::get('/gpa-calculations/{id}', [GpaController::class, 'show']);
    Route::put('/gpa-calculations/{id}', [GpaController::class, 'update']);
    Route::delete('/gpa-calculations/{id}', [GpaController::class, 'destroy']);
    Route::get('/gpa-calculations/stats/statistics', [GpaController::class, 'statistics']);

    // Marketplace (protected operations)
    Route::get('/marketplace/categories', [MarketplaceController::class, 'categories']);
    Route::get('/marketplace/my-items', [MarketplaceController::class, 'myItems']);
    Route::post('/marketplace', [MarketplaceController::class, 'store']);
    // Alias to support older frontend call
    Route::post('/marketplace/upload', [MarketplaceController::class, 'store']);
    Route::put('/marketplace/{id}', [MarketplaceController::class, 'update']);
    Route::delete('/marketplace/{id}', [MarketplaceController::class, 'destroy']);
    Route::post('/marketplace/{id}/contact', [MarketplaceController::class, 'contactSeller']);

    // Services (protected operations)
    Route::get('/services/my-services', [ServicesController::class, 'myServices']);
    Route::post('/services', [ServicesController::class, 'store']);
    Route::put('/services/{id}', [ServicesController::class, 'update']);
    Route::delete('/services/{id}', [ServicesController::class, 'destroy']);
    Route::post('/services/{id}/contact', [ServicesController::class, 'contactProvider']);

    // Events (protected operations)
    Route::get('/events/my-events', [EventsController::class, 'myEvents']);
    Route::post('/events', [EventsController::class, 'store']);
    Route::put('/events/{id}', [EventsController::class, 'update']);
    Route::delete('/events/{id}', [EventsController::class, 'destroy']);
    Route::post('/events/{id}/contact', [EventsController::class, 'contactOrganizer']);

    // Hostels (protected operations)
    Route::get('/hostels/my-hostels', [HostelsController::class, 'myHostels']);
    Route::post('/hostels', [HostelsController::class, 'store']);
    Route::put('/hostels/{id}', [HostelsController::class, 'update']);
    Route::delete('/hostels/{id}', [HostelsController::class, 'destroy']);
    Route::post('/hostels/{id}/contact', [HostelsController::class, 'contactOwner']);

    // Roommates (protected operations)
    Route::get('/roommates/my-listings', [RoommatesController::class, 'myListings']);
    Route::post('/roommates', [RoommatesController::class, 'store']);

    // Announcements
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/announcements/recent', [AnnouncementController::class, 'recent']);
    Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
    Route::get('/announcements/stats', [AnnouncementController::class, 'stats']);

    // Course Summaries (protected operations)
    Route::post('/course-summaries', [CourseSummariesController::class, 'store']);
    Route::put('/course-summaries/{id}', [CourseSummariesController::class, 'update']);
    Route::delete('/course-summaries/{id}', [CourseSummariesController::class, 'destroy']);

    // Past Questions (protected operations)
    Route::post('/past-questions', [PastQuestionsController::class, 'store']);
    Route::put('/past-questions/{id}', [PastQuestionsController::class, 'update']);
    Route::delete('/past-questions/{id}', [PastQuestionsController::class, 'destroy']);
});
