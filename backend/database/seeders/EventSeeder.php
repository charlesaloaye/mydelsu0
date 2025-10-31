<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\EventTicket;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get verified users to assign events to
        $users = User::where('is_verified', true)->take(10)->get();

        if ($users->isEmpty()) {
            $this->command->warn('No verified users found. Please run UserSeeder first.');
            return;
        }

        $events = [
            [
                'title' => 'Tech Conference 2024',
                'description' => 'Join us for the biggest tech conference of the year! Featuring keynote speakers, workshops, and networking opportunities. Topics include AI, blockchain, cybersecurity, and more. Don\'t miss this opportunity to learn from industry experts and connect with fellow tech enthusiasts.',
                'category' => 'Academic',
                'date' => Carbon::now()->addDays(30),
                'time' => '9:00 AM - 5:00 PM',
                'location' => 'Delsu Main Auditorium',
                'images' => [
                    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
                ],
                'tags' => ['Technology', 'Networking', 'AI', 'Blockchain'],
                'status' => 'upcoming',
                'sponsored' => true,
                'tickets' => [
                    [
                        'name' => 'Early Bird',
                        'price' => 10000,
                        'description' => 'Get discounted access to all sessions',
                        'benefits' => ['Access to all sessions', 'Networking lunch', 'Conference materials'],
                        'limited' => true,
                        'slots_left' => 50,
                        'sold' => 15,
                    ],
                    [
                        'name' => 'Regular',
                        'price' => 15000,
                        'description' => 'Full conference access',
                        'benefits' => ['Access to all sessions', 'Networking lunch', 'Conference materials'],
                        'limited' => false,
                        'sold' => 25,
                    ],
                    [
                        'name' => 'VIP',
                        'price' => 25000,
                        'description' => 'Premium experience with exclusive benefits',
                        'benefits' => ['VIP seating', 'Meet & greet with speakers', 'Exclusive dinner', 'Premium swag bag'],
                        'limited' => true,
                        'slots_left' => 10,
                        'sold' => 5,
                    ],
                ],
            ],
            [
                'title' => 'Coding Bootcamp Workshop',
                'description' => 'Intensive 3-day coding bootcamp covering modern web development technologies. Perfect for beginners and intermediate developers looking to upskill. Hands-on projects included.',
                'category' => 'Workshop',
                'date' => Carbon::now()->addDays(15),
                'time' => '10:00 AM - 4:00 PM',
                'location' => 'Computer Science Department Lab',
                'images' => [
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
                ],
                'tags' => ['Programming', 'Web Development', 'Hands-on'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Student Pass',
                        'price' => 15000,
                        'description' => 'Special rate for students',
                        'benefits' => ['Access to all sessions', 'Course materials', 'Certificate'],
                        'limited' => true,
                        'slots_left' => 20,
                        'sold' => 8,
                    ],
                    [
                        'name' => 'Standard',
                        'price' => 25000,
                        'description' => 'Full workshop access',
                        'benefits' => ['Access to all sessions', 'Course materials', 'Certificate', '1-on-1 mentorship'],
                        'limited' => false,
                        'sold' => 12,
                    ],
                ],
            ],
            [
                'title' => 'Cultural Night 2024',
                'description' => 'Experience the rich cultural heritage of Nigeria through music, dance, food, and art. Featuring performances from various ethnic groups and traditional cuisine. A night of celebration and unity.',
                'category' => 'Cultural',
                'date' => Carbon::now()->addDays(45),
                'time' => '6:00 PM - 11:00 PM',
                'location' => 'Delsu Sports Complex',
                'images' => [
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800'
                ],
                'tags' => ['Culture', 'Music', 'Food', 'Entertainment'],
                'status' => 'upcoming',
                'sponsored' => true,
                'tickets' => [
                    [
                        'name' => 'General Admission',
                        'price' => 3000,
                        'description' => 'Entry to the event',
                        'benefits' => ['Entry ticket', 'Cultural performances', 'Food samples'],
                        'limited' => false,
                        'sold' => 150,
                    ],
                    [
                        'name' => 'VIP',
                        'price' => 8000,
                        'description' => 'Premium seating and experience',
                        'benefits' => ['VIP seating', 'Full meal', 'Meet performers', 'Premium gift'],
                        'limited' => true,
                        'slots_left' => 20,
                        'sold' => 10,
                    ],
                ],
            ],
            [
                'title' => 'Entrepreneurship Summit',
                'description' => 'Connect with successful entrepreneurs, learn about business strategies, and discover funding opportunities. Panel discussions and networking sessions included.',
                'category' => 'Career',
                'date' => Carbon::now()->addDays(20),
                'time' => '2:00 PM - 6:00 PM',
                'location' => 'Business School Auditorium',
                'images' => [
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
                ],
                'tags' => ['Business', 'Networking', 'Entrepreneurship'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Standard',
                        'price' => 5000,
                        'description' => 'Access to summit',
                        'benefits' => ['Access to all sessions', 'Networking opportunities'],
                        'limited' => false,
                        'sold' => 45,
                    ],
                    [
                        'name' => 'Premium',
                        'price' => 10000,
                        'description' => 'Enhanced networking experience',
                        'benefits' => ['VIP access', 'Private networking session', 'Lunch with speakers', 'Premium materials'],
                        'limited' => true,
                        'slots_left' => 15,
                        'sold' => 10,
                    ],
                ],
            ],
            [
                'title' => 'Science Fair & Exhibition',
                'description' => 'Showcase your innovative projects and research findings. Open to all students and faculty. Prizes for best projects in different categories.',
                'category' => 'Academic',
                'date' => Carbon::now()->addDays(25),
                'time' => '9:00 AM - 3:00 PM',
                'location' => 'Science Faculty Building',
                'images' => [
                    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800'
                ],
                'tags' => ['Science', 'Innovation', 'Research'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Free Entry',
                        'price' => 0,
                        'description' => 'Open to all',
                        'benefits' => ['Entry to exhibition', 'View all projects'],
                        'limited' => false,
                        'sold' => 200,
                    ],
                ],
            ],
            [
                'title' => 'Music Concert: Afrobeat Night',
                'description' => 'Enjoy an evening of amazing Afrobeat music featuring local and international artists. Food and drinks available. Dress code: African attire encouraged.',
                'category' => 'Entertainment',
                'date' => Carbon::now()->addDays(12),
                'time' => '7:00 PM - 12:00 AM',
                'location' => 'Delsu Amphitheater',
                'images' => [
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
                ],
                'tags' => ['Music', 'Afrobeat', 'Entertainment'],
                'status' => 'upcoming',
                'sponsored' => true,
                'tickets' => [
                    [
                        'name' => 'General Admission',
                        'price' => 2000,
                        'description' => 'Entry to concert',
                        'benefits' => ['Concert access', 'Standing area'],
                        'limited' => false,
                        'sold' => 300,
                    ],
                    [
                        'name' => 'VIP',
                        'price' => 5000,
                        'description' => 'Premium experience',
                        'benefits' => ['VIP seating', 'Free drinks', 'Meet artists', 'VIP area access'],
                        'limited' => true,
                        'slots_left' => 30,
                        'sold' => 20,
                    ],
                ],
            ],
            [
                'title' => 'Career Development Workshop',
                'description' => 'Learn essential skills for career success including resume writing, interview techniques, networking, and professional development strategies.',
                'category' => 'Career',
                'date' => Carbon::now()->addDays(18),
                'time' => '11:00 AM - 3:00 PM',
                'location' => 'Career Services Center',
                'images' => [
                    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
                ],
                'tags' => ['Career', 'Professional Development', 'Skills'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Workshop Pass',
                        'price' => 2000,
                        'description' => 'Access to all sessions',
                        'benefits' => ['All sessions', 'Career materials', 'Certificate'],
                        'limited' => true,
                        'slots_left' => 25,
                        'sold' => 20,
                    ],
                ],
            ],
            [
                'title' => 'Sports Tournament Finals',
                'description' => 'Watch the finals of various sports tournaments including football, basketball, volleyball, and track events. Free entry for students with valid ID.',
                'category' => 'Sports',
                'date' => Carbon::now()->addDays(8),
                'time' => '3:00 PM - 7:00 PM',
                'location' => 'Delsu Sports Complex',
                'images' => [
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
                    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'
                ],
                'tags' => ['Sports', 'Tournament', 'Competition'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Free Entry',
                        'price' => 0,
                        'description' => 'Open to all students',
                        'benefits' => ['Entry to all games', 'Student ID required'],
                        'limited' => false,
                        'sold' => 500,
                    ],
                ],
            ],
            [
                'title' => 'Art & Photography Exhibition',
                'description' => 'View stunning artworks and photography from talented students and local artists. Art pieces available for purchase. Refreshments provided.',
                'category' => 'Cultural',
                'date' => Carbon::now()->addDays(35),
                'time' => '4:00 PM - 8:00 PM',
                'location' => 'Fine Arts Gallery',
                'images' => [
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
                    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800'
                ],
                'tags' => ['Art', 'Photography', 'Exhibition'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'General Admission',
                        'price' => 500,
                        'description' => 'Entry to exhibition',
                        'benefits' => ['View all artworks', 'Refreshments'],
                        'limited' => false,
                        'sold' => 80,
                    ],
                ],
            ],
            [
                'title' => 'Health & Wellness Seminar',
                'description' => 'Learn about mental health, physical wellness, stress management, and healthy living. Interactive sessions with health professionals and free health screenings.',
                'category' => 'Academic',
                'date' => Carbon::now()->addDays(22),
                'time' => '1:00 PM - 4:00 PM',
                'location' => 'Medical Center Conference Room',
                'images' => [
                    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800'
                ],
                'tags' => ['Health', 'Wellness', 'Mental Health'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Free Entry',
                        'price' => 0,
                        'description' => 'Open to all',
                        'benefits' => ['All sessions', 'Free health screening', 'Wellness materials'],
                        'limited' => false,
                        'sold' => 120,
                    ],
                ],
            ],
            [
                'title' => 'Gaming Tournament',
                'description' => 'Compete in various video games including FIFA, Call of Duty, and mobile games. Prizes for winners. Registration required. Bring your own devices.',
                'category' => 'Entertainment',
                'date' => Carbon::now()->addDays(14),
                'time' => '12:00 PM - 6:00 PM',
                'location' => 'Computer Lab 3',
                'images' => [
                    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'
                ],
                'tags' => ['Gaming', 'Tournament', 'Competition'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Participant',
                        'price' => 1500,
                        'description' => 'Tournament entry',
                        'benefits' => ['Tournament access', 'Chance to win prizes'],
                        'limited' => true,
                        'slots_left' => 40,
                        'sold' => 24,
                    ],
                    [
                        'name' => 'Spectator',
                        'price' => 500,
                        'description' => 'Watch the games',
                        'benefits' => ['Spectator access', 'Refreshments'],
                        'limited' => false,
                        'sold' => 50,
                    ],
                ],
            ],
            [
                'title' => 'Book Club Meeting',
                'description' => 'Monthly book discussion featuring "Things Fall Apart" by Chinua Achebe. Light refreshments provided. Open to all book lovers.',
                'category' => 'Academic',
                'date' => Carbon::now()->addDays(7),
                'time' => '5:00 PM - 7:00 PM',
                'location' => 'Library Conference Room',
                'images' => [
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
                ],
                'tags' => ['Books', 'Literature', 'Discussion'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Member',
                        'price' => 0,
                        'description' => 'Free for members',
                        'benefits' => ['Discussion participation', 'Refreshments'],
                        'limited' => false,
                        'sold' => 15,
                    ],
                ],
            ],
            [
                'title' => 'Environmental Awareness Campaign',
                'description' => 'Join us in promoting environmental sustainability. Tree planting, recycling workshop, and eco-friendly lifestyle tips. Free event with refreshments.',
                'category' => 'Academic',
                'date' => Carbon::now()->addDays(40),
                'time' => '8:00 AM - 2:00 PM',
                'location' => 'Botanical Garden',
                'images' => [
                    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
                ],
                'tags' => ['Environment', 'Sustainability', 'Volunteering'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Volunteer',
                        'price' => 0,
                        'description' => 'Free entry',
                        'benefits' => ['Participation certificate', 'Refreshments', 'Eco-friendly materials'],
                        'limited' => false,
                        'sold' => 80,
                    ],
                ],
            ],
            [
                'title' => 'Dance Workshop',
                'description' => 'Learn various dance styles including contemporary, hip-hop, and traditional Nigerian dances. All skill levels welcome. Comfortable clothing recommended.',
                'category' => 'Entertainment',
                'date' => Carbon::now()->addDays(28),
                'time' => '4:30 PM - 7:00 PM',
                'location' => 'Dance Studio',
                'images' => [
                    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'
                ],
                'tags' => ['Dance', 'Fitness', 'Cultural'],
                'status' => 'upcoming',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Workshop Pass',
                        'price' => 2000,
                        'description' => 'Full workshop access',
                        'benefits' => ['All sessions', 'Video recording'],
                        'limited' => true,
                        'slots_left' => 15,
                        'sold' => 25,
                    ],
                ],
            ],
            [
                'title' => 'Alumni Networking Event',
                'description' => 'Connect with successful Delsu alumni from various industries. Great opportunity for mentorship, internships, and job opportunities.',
                'category' => 'Career',
                'date' => Carbon::now()->addDays(50),
                'time' => '6:30 PM - 9:00 PM',
                'location' => 'Alumni Center',
                'images' => [
                    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800'
                ],
                'tags' => ['Networking', 'Career', 'Alumni'],
                'status' => 'upcoming',
                'sponsored' => true,
                'tickets' => [
                    [
                        'name' => 'Student Ticket',
                        'price' => 5000,
                        'description' => 'Special rate for students',
                        'benefits' => ['Networking access', 'Mentorship opportunities'],
                        'limited' => true,
                        'slots_left' => 50,
                        'sold' => 30,
                    ],
                    [
                        'name' => 'Standard',
                        'price' => 10000,
                        'description' => 'Full networking access',
                        'benefits' => ['Full access', 'Dinner', 'Premium networking'],
                        'limited' => false,
                        'sold' => 40,
                    ],
                ],
            ],
            // Add some completed and ongoing events
            [
                'title' => 'Past Event: Tech Meetup',
                'description' => 'A successful tech meetup that was held last month. This is a completed event for testing purposes.',
                'category' => 'Academic',
                'date' => Carbon::now()->subDays(15),
                'time' => '2:00 PM - 5:00 PM',
                'location' => 'Computer Science Department',
                'images' => [
                    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
                ],
                'tags' => ['Technology', 'Past Event'],
                'status' => 'completed',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'General Admission',
                        'price' => 0,
                        'description' => 'Free entry',
                        'benefits' => ['Access to event'],
                        'limited' => false,
                        'sold' => 100,
                    ],
                ],
            ],
            [
                'title' => 'Ongoing Event: Study Group Session',
                'description' => 'Currently ongoing study group session for final year students. Join in for group study and peer support.',
                'category' => 'Academic',
                'date' => Carbon::today(),
                'time' => '10:00 AM - 4:00 PM',
                'location' => 'Library Study Room',
                'images' => [
                    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
                ],
                'tags' => ['Study', 'Academic'],
                'status' => 'ongoing',
                'sponsored' => false,
                'tickets' => [
                    [
                        'name' => 'Participant',
                        'price' => 0,
                        'description' => 'Free participation',
                        'benefits' => ['Study materials', 'Group access'],
                        'limited' => false,
                        'sold' => 25,
                    ],
                ],
            ],
        ];

        foreach ($events as $eventData) {
            // Randomly assign to different verified users
            $user = $users->random();

            // Extract tickets from event data
            $ticketsData = $eventData['tickets'];
            unset($eventData['tickets']);

            // Create the event
            $event = Event::create([
                'user_id' => $user->id,
                'title' => $eventData['title'],
                'description' => $eventData['description'],
                'category' => $eventData['category'],
                'date' => $eventData['date'],
                'time' => $eventData['time'],
                'location' => $eventData['location'],
                'images' => $eventData['images'],
                'tags' => $eventData['tags'],
                'status' => $eventData['status'],
                'sponsored' => $eventData['sponsored'],
                'views' => rand(50, 500),
                'interested' => rand(10, 200),
            ]);

            // Calculate tickets_sold and revenue
            $ticketsSold = 0;
            $revenue = 0;

            // Create tickets for the event
            foreach ($ticketsData as $ticketData) {
                $ticket = EventTicket::create([
                    'event_id' => $event->id,
                    'name' => $ticketData['name'],
                    'price' => $ticketData['price'],
                    'description' => $ticketData['description'] ?? null,
                    'benefits' => $ticketData['benefits'] ?? [],
                    'limited' => $ticketData['limited'] ?? false,
                    'slots_left' => $ticketData['limited'] ? ($ticketData['slots_left'] ?? null) : null,
                    'sold' => $ticketData['sold'] ?? 0,
                ]);

                $ticketsSold += $ticket->sold;
                $revenue += ($ticket->price * $ticket->sold);
            }

            // Update event stats
            $event->update([
                'tickets_sold' => $ticketsSold,
                'revenue' => $revenue,
            ]);
        }

        $this->command->info('Events seeded successfully!');
    }
}
