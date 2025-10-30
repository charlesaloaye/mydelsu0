<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Please run UserSeeder first.');
            return;
        }

        $notificationTemplates = [
            [
                'title' => 'Welcome to myDelsu!',
                'message' => 'Welcome to myDelsu! Complete your profile to get started and earn rewards.',
                'type' => 'info',
            ],
            [
                'title' => 'Profile Verification',
                'message' => 'Your profile verification is pending. Upload your student ID to get verified.',
                'type' => 'warning',
            ],
            [
                'title' => 'Profile Approved!',
                'message' => 'Congratulations! Your profile has been verified successfully.',
                'type' => 'success',
            ],
            [
                'title' => 'New Past Questions',
                'message' => 'New past questions for MTH 401 have been uploaded. Check them out!',
                'type' => 'info',
            ],
            [
                'title' => 'Referral Bonus',
                'message' => 'You earned ₦500 from your referral! Keep inviting friends to earn more.',
                'type' => 'success',
            ],
            [
                'title' => 'Daily Reward Available',
                'message' => 'Your daily reward is ready! Watch an ad to claim ₦10.',
                'type' => 'info',
            ],
            [
                'title' => 'Wallet Funded',
                'message' => 'Your wallet has been credited with ₦5,000. Transaction successful.',
                'type' => 'success',
            ],
            [
                'title' => 'Withdrawal Successful',
                'message' => 'Your withdrawal of ₦2,500 has been processed and sent to your bank account.',
                'type' => 'success',
            ],
            [
                'title' => 'Airtime Purchase',
                'message' => 'MTN Airtime of ₦500 has been successfully purchased and sent to your number.',
                'type' => 'success',
            ],
            [
                'title' => 'Data Purchase',
                'message' => '2GB MTN Data has been successfully purchased and activated on your number.',
                'type' => 'success',
            ],
            [
                'title' => 'Exam Timetable',
                'message' => 'First semester examination timetable is now available. Check it out!',
                'type' => 'info',
            ],
            [
                'title' => 'Registration Deadline',
                'message' => 'Course registration closes in 3 days. Complete your registration now.',
                'type' => 'warning',
            ],
            [
                'title' => 'New Course Materials',
                'message' => 'Updated course outlines for 400 level students are now available.',
                'type' => 'info',
            ],
            [
                'title' => 'Contest Winner!',
                'message' => 'Congratulations! You won ₦2,000 in our weekly contest.',
                'type' => 'success',
            ],
            [
                'title' => 'System Maintenance',
                'message' => 'Scheduled maintenance will occur tonight from 12 AM to 2 AM. Some features may be unavailable.',
                'type' => 'warning',
            ],
        ];

        foreach ($users as $user) {
            // Create 5-15 notifications per user
            $notificationCount = rand(5, 15);
            
            for ($i = 0; $i < $notificationCount; $i++) {
                $template = $notificationTemplates[array_rand($notificationTemplates)];
                $isRead = rand(0, 1) == 1;
                
                // Random date within last 30 days
                $createdAt = now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'message' => $template['message'],
                    'type' => $template['type'],
                    'is_read' => $isRead,
                    'data' => json_encode([
                        'action_url' => rand(0, 1) ? '/dashboard' : '/wallet',
                        'priority' => rand(1, 5),
                    ]),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

        $this->command->info('Created notifications for ' . $users->count() . ' users.');
    }
}
