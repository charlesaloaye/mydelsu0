<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users
        $users = [
            [
                'first_name' => 'Victor',
                'last_name' => 'Ijomah',
                'email' => 'victor@test.com',
                'whatsapp' => '+2348100879906',
                'user_status' => 'current_student',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'profile_complete' => 100,
                'verification_status' => 'approved',
                'wallet_balance' => 15000.00,
                'referral_code' => 'VIC001',
                'how_did_you_hear' => 'friend',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah@test.com',
                'whatsapp' => '+2349012345678',
                'user_status' => 'current_student',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'profile_complete' => 85,
                'verification_status' => 'approved',
                'wallet_balance' => 8500.00,
                'referral_code' => 'SAR002',
                'how_did_you_hear' => 'social_media',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(2),
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'michael@test.com',
                'whatsapp' => '+2348023456789',
                'user_status' => 'aspirant',
                'password' => Hash::make('password123'),
                'is_verified' => false,
                'profile_complete' => 60,
                'verification_status' => 'not_submitted',
                'wallet_balance' => 2500.00,
                'referral_code' => 'MIC003',
                'how_did_you_hear' => 'website',
                'referral_number' => 'VIC001',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(1),
            ],
            [
                'first_name' => 'Grace',
                'last_name' => 'Williams',
                'email' => 'grace@test.com',
                'whatsapp' => '+2347034567890',
                'user_status' => 'alumni',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'profile_complete' => 95,
                'verification_status' => 'approved',
                'wallet_balance' => 22000.00,
                'referral_code' => 'GRA004',
                'how_did_you_hear' => 'friend',
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(5),
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Davis',
                'email' => 'david@test.com',
                'whatsapp' => '+2346045678901',
                'user_status' => 'current_student',
                'password' => Hash::make('password123'),
                'is_verified' => false,
                'profile_complete' => 40,
                'verification_status' => 'pending',
                'wallet_balance' => 1200.00,
                'referral_code' => 'DAV005',
                'how_did_you_hear' => 'advertisement',
                'referral_number' => 'SAR002',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subHours(12),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create additional users for referral testing
        for ($i = 6; $i <= 15; $i++) {
            User::create([
                'first_name' => 'User' . $i,
                'last_name' => 'Test',
                'email' => "user{$i}@test.com",
                'whatsapp' => '+234' . (5000000000 + $i),
                'user_status' => ['aspirant', 'current_student', 'alumni'][array_rand(['aspirant', 'current_student', 'alumni'])],
                'password' => Hash::make('password123'),
                'is_verified' => rand(0, 1) == 1,
                'profile_complete' => rand(20, 100),
                'verification_status' => ['not_submitted', 'pending', 'approved', 'rejected'][array_rand(['not_submitted', 'pending', 'approved', 'rejected'])],
                'wallet_balance' => rand(500, 50000) / 100,
                'referral_code' => 'USR' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'how_did_you_hear' => ['friend', 'social_media', 'website', 'advertisement'][array_rand(['friend', 'social_media', 'website', 'advertisement'])],
                'referral_number' => rand(0, 1) ? ['VIC001', 'SAR002', 'MIC003', 'GRA004'][array_rand(['VIC001', 'SAR002', 'MIC003', 'GRA004'])] : null,
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now()->subDays(rand(0, 10)),
            ]);
        }
    }
}
