<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Create New User ===\n\n";

// Get user input
echo "Enter user details:\n";

$firstName = readline("First Name: ");
$lastName = readline("Last Name: ");
$email = readline("Email: ");
$whatsapp = readline("WhatsApp Number: ");
$userStatus = readline("User Status (aspirant/current_student/alumni): ");
$password = readline("Password: ");

// Validate user status
$validStatuses = ['aspirant', 'current_student', 'alumni'];
if (!in_array($userStatus, $validStatuses)) {
    echo "❌ Invalid user status. Must be one of: " . implode(', ', $validStatuses) . "\n";
    exit(1);
}

// Generate referral code
$referralCode = strtoupper(substr($firstName, 0, 3)) . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

// Check if email already exists
if (User::where('email', $email)->exists()) {
    echo "❌ User with email {$email} already exists!\n";
    exit(1);
}

// Check if referral code already exists
while (User::where('referral_code', $referralCode)->exists()) {
    $referralCode = strtoupper(substr($firstName, 0, 3)) . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
}

try {
    $user = User::create([
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'whatsapp' => $whatsapp,
        'user_status' => $userStatus,
        'password' => Hash::make($password),
        'is_verified' => false,
        'profile_complete' => 0,
        'verification_status' => 'not_submitted',
        'wallet_balance' => 0.00,
        'referral_code' => $referralCode,
        'how_did_you_hear' => 'admin_created',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "\n✅ User created successfully!\n\n";
    echo "📋 User Details:\n";
    echo "   Name: {$user->first_name} {$user->last_name}\n";
    echo "   Email: {$user->email}\n";
    echo "   WhatsApp: {$user->whatsapp}\n";
    echo "   Status: {$user->user_status}\n";
    echo "   Referral Code: {$user->referral_code}\n";
    echo "   Password: {$password}\n";
    echo "   Verification: Not Verified\n";
    echo "   Wallet Balance: ₦0.00\n\n";

    echo "🔑 Login Credentials:\n";
    echo "   Email: {$user->email}\n";
    echo "   Password: {$password}\n\n";

    echo "You can now test the application with this new user!\n";
} catch (Exception $e) {
    echo "❌ Error creating user: " . $e->getMessage() . "\n";
    exit(1);
}
