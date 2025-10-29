<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Announcement;
use App\Models\User;
use Carbon\Carbon;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user as the creator (or create a default admin user)
        $adminUser = User::first();

        if (!$adminUser) {
            // Create a default admin user if none exists
            $adminUser = User::create([
                'first_name' => 'Admin',
                'last_name' => 'System',
                'email' => 'admin@mydelsu.com',
                'password' => bcrypt('password'),
                'whatsapp' => '08000000000',
                'is_verified' => true,
                'is_admin' => true,
            ]);
        }

        $announcements = [
            [
                'title' => 'Welcome to myDelsu Platform',
                'content' => 'Welcome to the myDelsu platform! We are excited to have you here. This platform provides various services including GPA calculator, marketplace, past questions, and more. Explore all the features and make the most of your academic journey.',
                'type' => 'info',
                'priority' => 'high',
                'target_audience' => 'all',
                'is_pinned' => true,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'Exam Timetable Released',
                'content' => 'First semester examination timetable is now available for download. Please check your department notice board or visit the student portal to download your personalized timetable. Good luck with your exams!',
                'type' => 'important',
                'priority' => 'urgent',
                'target_audience' => 'all',
                'is_pinned' => true,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'New Course Materials Available',
                'content' => 'Updated course outlines and materials for 400 level students have been uploaded to the platform. Please check your course pages to access the latest materials and assignments.',
                'type' => 'info',
                'priority' => 'medium',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'Registration Deadline Reminder',
                'content' => 'Course registration closes on Friday at 11:59 PM. Please complete your registration before the deadline to avoid any issues. Contact the academic office if you encounter any problems.',
                'type' => 'warning',
                'priority' => 'high',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'System Maintenance Notice',
                'content' => 'Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.',
                'type' => 'info',
                'priority' => 'low',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'GPA Calculator Feature',
                'content' => 'Our new GPA calculator is now available! Calculate your GPA easily and track your academic progress. Access it from the dashboard or navigation menu.',
                'type' => 'success',
                'priority' => 'medium',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'Marketplace Guidelines',
                'content' => 'Please read the marketplace guidelines before posting items for sale. Ensure all items are legitimate and follow the platform rules. Any violations may result in account suspension.',
                'type' => 'warning',
                'priority' => 'medium',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
            [
                'title' => 'Past Questions Collection',
                'content' => 'We are building a comprehensive collection of past examination questions. Help us by uploading past questions from your courses and earn rewards!',
                'type' => 'info',
                'priority' => 'low',
                'target_audience' => 'all',
                'is_pinned' => false,
                'created_by' => $adminUser->id,
            ],
        ];

        foreach ($announcements as $announcementData) {
            Announcement::create($announcementData);
        }
    }
}
