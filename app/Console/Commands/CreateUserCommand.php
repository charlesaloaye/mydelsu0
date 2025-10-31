<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {--name=} {--email=} {--phone=} {--status=current_student} {--password=password123}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user account';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Create New User ===');

        // Get user details
        $firstName = $this->option('name') ?: $this->ask('First Name');
        $lastName = $this->ask('Last Name');
        $email = $this->option('email') ?: $this->ask('Email');
        $whatsapp = $this->option('phone') ?: $this->ask('WhatsApp Number');
        $userStatus = $this->option('status');
        $password = $this->option('password');

        // Validate user status
        $validStatuses = ['aspirant', 'current_student', 'alumni'];
        if (!in_array($userStatus, $validStatuses)) {
            $this->error('Invalid user status. Must be one of: ' . implode(', ', $validStatuses));
            return 1;
        }

        // Check if email already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists!");
            return 1;
        }

        // Generate referral code
        $referralCode = strtoupper(substr($firstName, 0, 3)) . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
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
            ]);

            $this->info('✅ User created successfully!');
            $this->line('');
            $this->line('📋 User Details:');
            $this->line("   Name: {$user->first_name} {$user->last_name}");
            $this->line("   Email: {$user->email}");
            $this->line("   WhatsApp: {$user->whatsapp}");
            $this->line("   Status: {$user->user_status}");
            $this->line("   Referral Code: {$user->referral_code}");
            $this->line("   Password: {$password}");
            $this->line("   Verification: Not Verified");
            $this->line("   Wallet Balance: ₦0.00");
            $this->line('');
            $this->line('🔑 Login Credentials:');
            $this->line("   Email: {$user->email}");
            $this->line("   Password: {$password}");
            $this->line('');
            $this->line('You can now test the application with this new user!');
        } catch (\Exception $e) {
            $this->error('Error creating user: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
