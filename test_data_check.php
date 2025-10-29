<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Transaction;
use App\Models\Notification;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== myDelsu Test Data Check ===\n\n";

// Check Users
$userCount = User::count();
echo "📊 Users: {$userCount}\n";

$verifiedUsers = User::where('is_verified', true)->count();
$unverifiedUsers = User::where('is_verified', false)->count();
echo "   ✅ Verified: {$verifiedUsers}\n";
echo "   ❌ Unverified: {$unverifiedUsers}\n";

$currentStudents = User::where('user_status', 'current_student')->count();
$aspirants = User::where('user_status', 'aspirant')->count();
$alumni = User::where('user_status', 'alumni')->count();
echo "   🎓 Current Students: {$currentStudents}\n";
echo "   🎯 Aspirants: {$aspirants}\n";
echo "   👨‍🎓 Alumni: {$alumni}\n\n";

// Check Transactions
$transactionCount = Transaction::count();
echo "💰 Transactions: {$transactionCount}\n";

$creditTransactions = Transaction::where('type', 'credit')->count();
$debitTransactions = Transaction::where('type', 'debit')->count();
echo "   📈 Credits: {$creditTransactions}\n";
echo "   📉 Debits: {$debitTransactions}\n";

$completedTransactions = Transaction::where('status', 'completed')->count();
$pendingTransactions = Transaction::where('status', 'pending')->count();
$failedTransactions = Transaction::where('status', 'failed')->count();
echo "   ✅ Completed: {$completedTransactions}\n";
echo "   ⏳ Pending: {$pendingTransactions}\n";
echo "   ❌ Failed: {$failedTransactions}\n\n";

// Check Notifications
$notificationCount = Notification::count();
echo "🔔 Notifications: {$notificationCount}\n";

$readNotifications = Notification::where('is_read', true)->count();
$unreadNotifications = Notification::where('is_read', false)->count();
echo "   ✅ Read: {$readNotifications}\n";
echo "   📬 Unread: {$unreadNotifications}\n\n";

// Sample Test Accounts
echo "🔑 Test Accounts:\n";
$testUsers = User::whereIn('email', [
    'victor@test.com',
    'sarah@test.com',
    'michael@test.com',
    'grace@test.com',
    'david@test.com'
])->get();

foreach ($testUsers as $user) {
    $walletBalance = number_format($user->wallet_balance, 2);
    $verificationStatus = $user->is_verified ? '✅' : '❌';
    $profileComplete = $user->profile_complete . '%';
    
    echo "   {$user->email} | Password: password123 | Wallet: ₦{$walletBalance} | {$verificationStatus} | Profile: {$profileComplete}\n";
}

echo "\n🎉 Test data created successfully!\n";
echo "You can now test the application with the above accounts.\n";
