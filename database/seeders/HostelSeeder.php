<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketplaceItem;
use App\Models\User;

class HostelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to assign hostels to
        $users = User::take(10)->get();

        if ($users->isEmpty()) {
            // Create test users if none exist
            $testUsers = [
                [
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'email' => 'john.doe@example.com',
                    'password' => bcrypt('password'),
                    'phone' => '08012345678',
                    'matric_number' => 'DEL/2021/001',
                    'department' => 'Computer Science',
                    'level' => '300',
                    'is_verified' => true,
                ],
                [
                    'first_name' => 'Jane',
                    'last_name' => 'Smith',
                    'email' => 'jane.smith@example.com',
                    'password' => bcrypt('password'),
                    'phone' => '08023456789',
                    'matric_number' => 'DEL/2021/002',
                    'department' => 'Business Administration',
                    'level' => '400',
                    'is_verified' => true,
                ],
                [
                    'first_name' => 'Michael',
                    'last_name' => 'Johnson',
                    'email' => 'michael.johnson@example.com',
                    'password' => bcrypt('password'),
                    'phone' => '08034567890',
                    'matric_number' => 'DEL/2021/003',
                    'department' => 'Engineering',
                    'level' => '200',
                    'is_verified' => true,
                ],
                [
                    'first_name' => 'Sarah',
                    'last_name' => 'Williams',
                    'email' => 'sarah.williams@example.com',
                    'password' => bcrypt('password'),
                    'phone' => '08045678901',
                    'matric_number' => 'DEL/2021/004',
                    'department' => 'Medicine',
                    'level' => '500',
                    'is_verified' => true,
                ],
                [
                    'first_name' => 'David',
                    'last_name' => 'Brown',
                    'email' => 'david.brown@example.com',
                    'password' => bcrypt('password'),
                    'phone' => '08056789012',
                    'matric_number' => 'DEL/2021/005',
                    'department' => 'Law',
                    'level' => '400',
                    'is_verified' => true,
                ]
            ];

            foreach ($testUsers as $userData) {
                User::create($userData);
            }
            $users = User::take(10)->get();
        }

        $hostelData = [
            // Single Rooms
            [
                'title' => 'Cozy Single Room - Near Campus Gate',
                'description' => 'Furnished single room available for rent. 3 minutes walk to campus main gate. Includes bed, wardrobe, study table, chair, and ceiling fan. Shared kitchen and bathroom facilities. Generator available. Perfect for serious students who prefer quiet environment.',
                'price' => 25000,
                'location' => 'Off Campus - Abraka, Near Main Gate',
                'contact' => '08012345678',
                'amenities' => 'WiFi, Generator, Security, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Modern Single Room - Self Contained',
                'description' => 'Self-contained single room with private bathroom and kitchenette. 5 minutes walk to campus. Fully furnished with bed, wardrobe, study table, refrigerator, and fan. WiFi included. Generator backup available. Ideal for students who value privacy.',
                'price' => 45000,
                'location' => 'Off Campus - Abraka, Close to Campus',
                'contact' => '08023456789',
                'amenities' => 'WiFi, Generator, Security, Private Bathroom, Kitchenette, Refrigerator',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Budget Single Room - Student Friendly',
                'description' => 'Affordable single room for budget-conscious students. 7 minutes walk to campus. Basic furnishings include bed, wardrobe, and study table. Shared facilities with other students. Clean and secure environment.',
                'price' => 18000,
                'location' => 'Off Campus - Abraka, Student Area',
                'contact' => '08034567890',
                'amenities' => 'Security, Shared Kitchen, Shared Bathroom, Study Area',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],

            // Shared Rooms
            [
                'title' => '2-Bedroom Apartment - Roommate Wanted',
                'description' => 'Looking for a responsible roommate to share 2-bedroom apartment. Furnished with modern amenities. WiFi, generator, and security included. Close to campus and market. Female students preferred. Monthly rent per person.',
                'price' => 20000,
                'location' => 'Off Campus - Abraka, Near Market',
                'contact' => '08045678901',
                'amenities' => 'WiFi, Generator, Security, Shared Kitchen, Shared Living Room, Balcony',
                'availability' => 'available',
                'room_type' => 'shared',
                'gender' => 'female',
                'images' => [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Male Only Hostel - Near University',
                'description' => 'Male-only hostel with modern facilities and close proximity to university campus. Shared rooms available for 2-3 students. Includes WiFi, generator, security, common room, and study area. Perfect for male students.',
                'price' => 15000,
                'location' => 'Off Campus - Abraka, University Area',
                'contact' => '08056789012',
                'amenities' => 'WiFi, Generator, Security, Common Room, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'shared',
                'gender' => 'male',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Female Hostel - Secure Environment',
                'description' => 'Exclusive female hostel with 24/7 security. Shared rooms for 2-3 students. Modern facilities including WiFi, generator, common room, and study area. Close to campus and market. Female students only.',
                'price' => 18000,
                'location' => 'Off Campus - Abraka, Secure Area',
                'contact' => '08067890123',
                'amenities' => 'WiFi, Generator, 24/7 Security, Common Room, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'shared',
                'gender' => 'female',
                'images' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],

            // Self-Contained Apartments
            [
                'title' => '1-Bedroom Self-Contained - Fully Furnished',
                'description' => 'Fully furnished 1-bedroom self-contained apartment. Private bathroom and kitchen. 4 minutes walk to campus. Includes bed, wardrobe, study table, refrigerator, gas cooker, and fan. WiFi and generator included.',
                'price' => 55000,
                'location' => 'Off Campus - Abraka, Prime Location',
                'contact' => '08078901234',
                'amenities' => 'WiFi, Generator, Security, Private Bathroom, Private Kitchen, Refrigerator, Gas Cooker',
                'availability' => 'available',
                'room_type' => 'self_contained',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => '2-Bedroom Self-Contained - Family Size',
                'description' => 'Spacious 2-bedroom self-contained apartment. Perfect for couples or students who prefer more space. Private bathroom and kitchen. 6 minutes walk to campus. Fully furnished with modern amenities.',
                'price' => 75000,
                'location' => 'Off Campus - Abraka, Residential Area',
                'contact' => '08089012345',
                'amenities' => 'WiFi, Generator, Security, Private Bathroom, Private Kitchen, Living Room, Balcony',
                'availability' => 'available',
                'room_type' => 'self_contained',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
                ]
            ],

            // Luxury Accommodations
            [
                'title' => 'Premium Single Room - All Inclusive',
                'description' => 'Premium single room with all modern amenities. Air conditioning, WiFi, generator, private bathroom, and kitchenette. 2 minutes walk to campus. Perfect for students who want comfort and convenience.',
                'price' => 65000,
                'location' => 'Off Campus - Abraka, Premium Area',
                'contact' => '08090123456',
                'amenities' => 'WiFi, Generator, Security, Air Conditioning, Private Bathroom, Kitchenette, Refrigerator, Study Area',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Executive Apartment - Near Campus',
                'description' => 'Executive 1-bedroom apartment with premium finishes. Private bathroom, kitchen, living area, and balcony. WiFi, generator, and security included. 3 minutes walk to campus. Ideal for graduate students.',
                'price' => 85000,
                'location' => 'Off Campus - Abraka, Executive Area',
                'contact' => '08101234567',
                'amenities' => 'WiFi, Generator, Security, Private Bathroom, Private Kitchen, Living Room, Balcony, Air Conditioning',
                'availability' => 'available',
                'room_type' => 'self_contained',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
                ]
            ],

            // Budget Options
            [
                'title' => 'Economy Room - Student Budget',
                'description' => 'Basic single room for students on tight budget. 10 minutes walk to campus. Includes bed, wardrobe, and study table. Shared kitchen and bathroom. Clean and secure environment.',
                'price' => 12000,
                'location' => 'Off Campus - Abraka, Budget Area',
                'contact' => '08112345678',
                'amenities' => 'Security, Shared Kitchen, Shared Bathroom, Study Area',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Shared Room - 3 Students',
                'description' => 'Shared room for 3 students. Very affordable option. 8 minutes walk to campus. Basic furnishings with shared facilities. Perfect for students who want to save money.',
                'price' => 8000,
                'location' => 'Off Campus - Abraka, Student Area',
                'contact' => '08123456789',
                'amenities' => 'Security, Shared Kitchen, Shared Bathroom, Study Area',
                'availability' => 'available',
                'room_type' => 'shared',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],

            // Special Features
            [
                'title' => 'Hostel with Gym - Fitness Enthusiasts',
                'description' => 'Modern hostel with on-site gym facility. Single and shared rooms available. WiFi, generator, security, and gym access included. 5 minutes walk to campus. Perfect for fitness-conscious students.',
                'price' => 35000,
                'location' => 'Off Campus - Abraka, Fitness Area',
                'contact' => '08134567890',
                'amenities' => 'WiFi, Generator, Security, Gym, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Quiet Study Hostel - Academic Focus',
                'description' => 'Hostel designed for serious students. Quiet environment with dedicated study areas. Single rooms with WiFi, generator, and security. 4 minutes walk to campus. Perfect for students who prioritize academics.',
                'price' => 30000,
                'location' => 'Off Campus - Abraka, Academic Area',
                'contact' => '08145678901',
                'amenities' => 'WiFi, Generator, Security, Quiet Study Areas, Library Access, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
                ]
            ],

            // Coming Soon
            [
                'title' => 'New Hostel Complex - Coming Soon',
                'description' => 'Brand new hostel complex opening next semester. Modern facilities with single and shared rooms. WiFi, generator, security, common areas, and study rooms. Pre-booking available with discount.',
                'price' => 40000,
                'location' => 'Off Campus - Abraka, New Development',
                'contact' => '08156789012',
                'amenities' => 'WiFi, Generator, Security, Common Areas, Study Rooms, Shared Kitchen, Shared Bathroom',
                'availability' => 'coming_soon',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
                ]
            ],

            // Additional Variety
            [
                'title' => 'Hostel with Laundry Service',
                'description' => 'Convenient hostel with on-site laundry service. Single rooms available. WiFi, generator, security, and laundry service included. 6 minutes walk to campus. Perfect for busy students.',
                'price' => 28000,
                'location' => 'Off Campus - Abraka, Convenience Area',
                'contact' => '08167890123',
                'amenities' => 'WiFi, Generator, Security, Laundry Service, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Hostel with Parking Space',
                'description' => 'Hostel with dedicated parking space for students with vehicles. Single and shared rooms available. WiFi, generator, security, and parking included. 7 minutes walk to campus.',
                'price' => 32000,
                'location' => 'Off Campus - Abraka, Parking Area',
                'contact' => '08178901234',
                'amenities' => 'WiFi, Generator, Security, Parking Space, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Hostel with Rooftop Garden',
                'description' => 'Unique hostel with beautiful rooftop garden. Single rooms with WiFi, generator, and security. Rooftop garden for relaxation and study. 5 minutes walk to campus. Perfect for nature lovers.',
                'price' => 26000,
                'location' => 'Off Campus - Abraka, Garden Area',
                'contact' => '08189012345',
                'amenities' => 'WiFi, Generator, Security, Rooftop Garden, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Hostel with 24/7 Security',
                'description' => 'Ultra-secure hostel with 24/7 security personnel and CCTV. Single rooms with WiFi, generator, and round-the-clock security. 3 minutes walk to campus. Perfect for safety-conscious students.',
                'price' => 38000,
                'location' => 'Off Campus - Abraka, Secure Zone',
                'contact' => '08190123456',
                'amenities' => 'WiFi, Generator, 24/7 Security, CCTV, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
                ]
            ],
            [
                'title' => 'Hostel with High-Speed Internet',
                'description' => 'Hostel with premium high-speed internet connection. Perfect for students who need reliable internet for online classes and research. Single rooms with WiFi, generator, and security. 4 minutes walk to campus.',
                'price' => 33000,
                'location' => 'Off Campus - Abraka, Tech Area',
                'contact' => '08201234567',
                'amenities' => 'High-Speed WiFi, Generator, Security, Study Area, Shared Kitchen, Shared Bathroom',
                'availability' => 'available',
                'room_type' => 'single',
                'gender' => 'mixed',
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop'
                ]
            ]
        ];

        foreach ($hostelData as $hostel) {
            MarketplaceItem::create([
                'user_id' => $users->random()->id,
                'title' => $hostel['title'],
                'description' => $hostel['description'],
                'price' => $hostel['price'],
                'category' => 'hostels',
                'location' => $hostel['location'],
                'contact' => $hostel['contact'],
                'amenities' => $hostel['amenities'],
                'availability' => $hostel['availability'],
                'room_type' => $hostel['room_type'],
                'gender' => $hostel['gender'],
                'status' => 'active',
                'images' => json_encode($hostel['images']),
                'created_at' => now()->subDays(rand(1, 30)), // Random creation date within last 30 days
            ]);
        }

        $this->command->info('Hostel and accommodation data seeded successfully!');
    }
}
