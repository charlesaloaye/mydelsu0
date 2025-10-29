<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketplaceItem;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to assign events to
        $users = User::take(5)->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $events = [
            [
                'title' => 'Tech Conference 2024',
                'description' => 'Join us for the biggest tech conference of the year! Featuring keynote speakers, workshops, and networking opportunities. Topics include AI, blockchain, cybersecurity, and more.',
                'price' => 15000.00,
                'location' => 'Delsu Main Auditorium',
                'contact' => '+234-801-234-5678',
                'event_date' => Carbon::now()->addDays(30),
                'event_time' => '09:00:00',
                'event_type' => 'conference',
                'max_attendees' => 500,
                'current_attendees' => 0,
                'images' => ['events/tech-conference-1.jpg', 'events/tech-conference-2.jpg'],
            ],
            [
                'title' => 'Coding Bootcamp Workshop',
                'description' => 'Intensive 3-day coding bootcamp covering modern web development technologies. Perfect for beginners and intermediate developers looking to upskill.',
                'price' => 25000.00,
                'location' => 'Computer Science Department Lab',
                'contact' => '+234-802-345-6789',
                'event_date' => Carbon::now()->addDays(15),
                'event_time' => '10:00:00',
                'event_type' => 'workshop',
                'max_attendees' => 30,
                'current_attendees' => 0,
                'images' => ['events/coding-bootcamp-1.jpg'],
            ],
            [
                'title' => 'Cultural Night 2024',
                'description' => 'Experience the rich cultural heritage of Nigeria through music, dance, food, and art. Featuring performances from various ethnic groups and traditional cuisine.',
                'price' => 5000.00,
                'location' => 'Delsu Sports Complex',
                'contact' => '+234-803-456-7890',
                'event_date' => Carbon::now()->addDays(45),
                'event_time' => '18:00:00',
                'event_type' => 'cultural',
                'max_attendees' => 1000,
                'current_attendees' => 0,
                'images' => ['events/cultural-night-1.jpg', 'events/cultural-night-2.jpg'],
            ],
            [
                'title' => 'Entrepreneurship Summit',
                'description' => 'Connect with successful entrepreneurs, learn about business strategies, and discover funding opportunities. Panel discussions and networking sessions included.',
                'price' => 8000.00,
                'location' => 'Business School Auditorium',
                'contact' => '+234-804-567-8901',
                'event_date' => Carbon::now()->addDays(20),
                'event_time' => '14:00:00',
                'event_type' => 'summit',
                'max_attendees' => 200,
                'current_attendees' => 0,
                'images' => ['events/entrepreneurship-summit-1.jpg'],
            ],
            [
                'title' => 'Science Fair & Exhibition',
                'description' => 'Showcase your innovative projects and research findings. Open to all students and faculty. Prizes for best projects in different categories.',
                'price' => 2000.00,
                'location' => 'Science Faculty Building',
                'contact' => '+234-805-678-9012',
                'event_date' => Carbon::now()->addDays(25),
                'event_time' => '09:30:00',
                'event_type' => 'exhibition',
                'max_attendees' => 300,
                'current_attendees' => 0,
                'images' => ['events/science-fair-1.jpg', 'events/science-fair-2.jpg'],
            ],
            [
                'title' => 'Music Concert: Afrobeat Night',
                'description' => 'Enjoy an evening of amazing Afrobeat music featuring local and international artists. Food and drinks available. Dress code: African attire encouraged.',
                'price' => 3000.00,
                'location' => 'Delsu Amphitheater',
                'contact' => '+234-806-789-0123',
                'event_date' => Carbon::now()->addDays(12),
                'event_time' => '19:00:00',
                'event_type' => 'concert',
                'max_attendees' => 800,
                'current_attendees' => 0,
                'images' => ['events/afrobeat-concert-1.jpg'],
            ],
            [
                'title' => 'Career Development Workshop',
                'description' => 'Learn essential skills for career success including resume writing, interview techniques, networking, and professional development strategies.',
                'price' => 4000.00,
                'location' => 'Career Services Center',
                'contact' => '+234-807-890-1234',
                'event_date' => Carbon::now()->addDays(18),
                'event_time' => '11:00:00',
                'event_type' => 'workshop',
                'max_attendees' => 50,
                'current_attendees' => 0,
                'images' => ['events/career-workshop-1.jpg'],
            ],
            [
                'title' => 'Sports Tournament Finals',
                'description' => 'Watch the finals of various sports tournaments including football, basketball, volleyball, and track events. Free entry for students with valid ID.',
                'price' => 0.00,
                'location' => 'Delsu Sports Complex',
                'contact' => '+234-808-901-2345',
                'event_date' => Carbon::now()->addDays(8),
                'event_time' => '15:00:00',
                'event_type' => 'sports',
                'max_attendees' => 2000,
                'current_attendees' => 0,
                'images' => ['events/sports-tournament-1.jpg', 'events/sports-tournament-2.jpg'],
            ],
            [
                'title' => 'Art & Photography Exhibition',
                'description' => 'View stunning artworks and photography from talented students and local artists. Art pieces available for purchase. Refreshments provided.',
                'price' => 1000.00,
                'location' => 'Fine Arts Gallery',
                'contact' => '+234-809-012-3456',
                'event_date' => Carbon::now()->addDays(35),
                'event_time' => '16:00:00',
                'event_type' => 'exhibition',
                'max_attendees' => 150,
                'current_attendees' => 0,
                'images' => ['events/art-exhibition-1.jpg', 'events/art-exhibition-2.jpg'],
            ],
            [
                'title' => 'Health & Wellness Seminar',
                'description' => 'Learn about mental health, physical wellness, stress management, and healthy living. Interactive sessions with health professionals and free health screenings.',
                'price' => 1500.00,
                'location' => 'Medical Center Conference Room',
                'contact' => '+234-810-123-4567',
                'event_date' => Carbon::now()->addDays(22),
                'event_time' => '13:00:00',
                'event_type' => 'seminar',
                'max_attendees' => 100,
                'current_attendees' => 0,
                'images' => ['events/health-seminar-1.jpg'],
            ],
            [
                'title' => 'Gaming Tournament',
                'description' => 'Compete in various video games including FIFA, Call of Duty, and mobile games. Prizes for winners. Registration required. Bring your own devices.',
                'price' => 2000.00,
                'location' => 'Computer Lab 3',
                'contact' => '+234-811-234-5678',
                'event_date' => Carbon::now()->addDays(14),
                'event_time' => '12:00:00',
                'event_type' => 'tournament',
                'max_attendees' => 64,
                'current_attendees' => 0,
                'images' => ['events/gaming-tournament-1.jpg'],
            ],
            [
                'title' => 'Book Club Meeting',
                'description' => 'Monthly book discussion featuring "Things Fall Apart" by Chinua Achebe. Light refreshments provided. Open to all book lovers.',
                'price' => 500.00,
                'location' => 'Library Conference Room',
                'contact' => '+234-812-345-6789',
                'event_date' => Carbon::now()->addDays(7),
                'event_time' => '17:00:00',
                'event_type' => 'meeting',
                'max_attendees' => 25,
                'current_attendees' => 0,
                'images' => ['events/book-club-1.jpg'],
            ],
            [
                'title' => 'Environmental Awareness Campaign',
                'description' => 'Join us in promoting environmental sustainability. Tree planting, recycling workshop, and eco-friendly lifestyle tips. Free event with refreshments.',
                'price' => 0.00,
                'location' => 'Botanical Garden',
                'contact' => '+234-813-456-7890',
                'event_date' => Carbon::now()->addDays(40),
                'event_time' => '08:00:00',
                'event_type' => 'campaign',
                'max_attendees' => 200,
                'current_attendees' => 0,
                'images' => ['events/environmental-campaign-1.jpg'],
            ],
            [
                'title' => 'Dance Workshop',
                'description' => 'Learn various dance styles including contemporary, hip-hop, and traditional Nigerian dances. All skill levels welcome. Comfortable clothing recommended.',
                'price' => 3000.00,
                'location' => 'Dance Studio',
                'contact' => '+234-814-567-8901',
                'event_date' => Carbon::now()->addDays(28),
                'event_time' => '16:30:00',
                'event_type' => 'workshop',
                'max_attendees' => 40,
                'current_attendees' => 0,
                'images' => ['events/dance-workshop-1.jpg'],
            ],
            [
                'title' => 'Alumni Networking Event',
                'description' => 'Connect with successful Delsu alumni from various industries. Great opportunity for mentorship, internships, and job opportunities.',
                'price' => 10000.00,
                'location' => 'Alumni Center',
                'contact' => '+234-815-678-9012',
                'event_date' => Carbon::now()->addDays(50),
                'event_time' => '18:30:00',
                'event_type' => 'networking',
                'max_attendees' => 150,
                'current_attendees' => 0,
                'images' => ['events/alumni-networking-1.jpg'],
            ]
        ];

        foreach ($events as $eventData) {
            // Randomly assign to different users
            $user = $users->random();

            MarketplaceItem::create([
                'user_id' => $user->id,
                'title' => $eventData['title'],
                'description' => $eventData['description'],
                'price' => $eventData['price'],
                'category' => 'events',
                'location' => $eventData['location'],
                'contact' => $eventData['contact'],
                'status' => 'active',
                'event_date' => $eventData['event_date'],
                'event_time' => $eventData['event_time'],
                'event_type' => $eventData['event_type'],
                'max_attendees' => $eventData['max_attendees'],
                'current_attendees' => $eventData['current_attendees'],
                'images' => $eventData['images'],
            ]);
        }

        $this->command->info('Events seeded successfully!');
    }
}
