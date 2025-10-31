<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketplaceItem;
use App\Models\User;

class MarketplaceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to assign items to
        $users = User::take(5)->get();

        if ($users->isEmpty()) {
            // Create a test user if none exist
            $user = User::create([
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'phone' => '08012345678',
                'matric_number' => 'DEL/2021/001',
                'department' => 'Computer Science',
                'level' => '300',
                'is_verified' => true,
            ]);
            $users = collect([$user]);
        }

        $sampleItems = [
            // Electronics
            [
                'title' => 'MacBook Pro 13" - Excellent Condition',
                'description' => 'MacBook Pro 13-inch, 8GB RAM, 256GB SSD. Used for 2 years, still in excellent condition. Perfect for programming and design work. Comes with original charger and case.',
                'price' => 450000,
                'category' => 'for-sale',
                'location' => 'Campus - Faculty of Science',
                'contact' => '08012345678',
                'images' => ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'iPhone 12 Pro Max - 128GB',
                'description' => 'iPhone 12 Pro Max in Space Gray, 128GB storage. Used for 1 year, no scratches, battery health 95%. Includes original box, charger, and screen protector.',
                'price' => 280000,
                'category' => 'for-sale',
                'location' => 'Off Campus - Abraka',
                'contact' => '08023456789',
                'images' => ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Samsung Galaxy Buds Pro',
                'description' => 'Samsung Galaxy Buds Pro wireless earbuds. Excellent sound quality, noise cancellation, water resistant. Used for 6 months, still under warranty.',
                'price' => 45000,
                'category' => 'for-sale',
                'location' => 'Campus - Library',
                'contact' => '08034567890',
                'images' => ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop']
            ],

            // Textbooks
            [
                'title' => 'Introduction to Algorithms - 3rd Edition',
                'description' => 'CLRS Introduction to Algorithms textbook. Essential for computer science students. Good condition, some highlighting but pages are intact.',
                'price' => 15000,
                'category' => 'for-sale',
                'location' => 'Campus - Computer Science Department',
                'contact' => '08045678901',
                'images' => ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Calculus and Analytical Geometry - 7th Edition',
                'description' => 'Thomas Calculus textbook, 7th edition. Used for MATH 101 and MATH 102. Good condition with some notes in margins.',
                'price' => 12000,
                'category' => 'for-sale',
                'location' => 'Campus - Mathematics Department',
                'contact' => '08056789012',
                'images' => ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Organic Chemistry - Wade 8th Edition',
                'description' => 'Organic Chemistry textbook by Wade, 8th edition. Essential for chemistry students. Excellent condition, no highlighting.',
                'price' => 18000,
                'category' => 'for-sale',
                'location' => 'Campus - Chemistry Department',
                'contact' => '08067890123',
                'images' => ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop']
            ],

            // Clothing
            [
                'title' => 'Designer Jeans - Size 32',
                'description' => 'Levi\'s 501 Original Fit Jeans, size 32. Worn only a few times, still looks new. Perfect for casual wear.',
                'price' => 8000,
                'category' => 'for-sale',
                'location' => 'Off Campus - Abraka',
                'contact' => '08078901234',
                'images' => ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Nike Air Force 1 - Size 42',
                'description' => 'Nike Air Force 1 white sneakers, size 42. Worn for 3 months, still in good condition. Perfect for daily wear.',
                'price' => 25000,
                'category' => 'for-sale',
                'location' => 'Campus - Sports Complex',
                'contact' => '08089012345',
                'images' => ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop']
            ],

            // Hostels
            [
                'title' => 'Single Room Available - Near Campus',
                'description' => 'Furnished single room available for rent. 5 minutes walk to campus. Includes bed, wardrobe, study table, and fan. Shared kitchen and bathroom.',
                'price' => 25000,
                'category' => 'hostels',
                'location' => 'Off Campus - Abraka',
                'contact' => '08090123456',
                'images' => ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
            ],
            [
                'title' => '2-Bedroom Apartment - Shared',
                'description' => 'Looking for a roommate to share 2-bedroom apartment. Furnished, with WiFi, generator, and security. Close to campus and market.',
                'price' => 15000,
                'category' => 'hostels',
                'location' => 'Off Campus - Abraka',
                'contact' => '08101234567',
                'images' => ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']
            ],

            // Services
            [
                'title' => 'Web Development Services',
                'description' => 'Professional web development services. HTML, CSS, JavaScript, React, Node.js. Portfolio available. Affordable rates for students.',
                'price' => 50000,
                'category' => 'services',
                'location' => 'Campus - Computer Science Department',
                'contact' => '08112345678',
                'images' => ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Mathematics Tutoring',
                'description' => 'Mathematics tutoring for 100-400 level students. Specializes in Calculus, Statistics, and Linear Algebra. Flexible schedule.',
                'price' => 2000,
                'category' => 'services',
                'location' => 'Campus - Library',
                'contact' => '08123456789',
                'images' => ['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Photography Services',
                'description' => 'Professional photography services for events, portraits, and graduation photos. High-quality equipment and editing included.',
                'price' => 15000,
                'category' => 'services',
                'location' => 'Campus - Art Department',
                'contact' => '08134567890',
                'images' => ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop']
            ],

            // Jobs
            [
                'title' => 'Part-time Sales Representative',
                'description' => 'Part-time sales representative needed for mobile phone accessories. Flexible hours, commission-based. Perfect for students.',
                'price' => 20000,
                'category' => 'jobs',
                'location' => 'Off Campus - Abraka Market',
                'contact' => '08145678901',
                'images' => ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Content Writer - Remote',
                'description' => 'Remote content writing position. Write articles, blog posts, and social media content. Flexible schedule, work from anywhere.',
                'price' => 15000,
                'category' => 'jobs',
                'location' => 'Remote',
                'contact' => '08156789012',
                'images' => ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Campus Tour Guide',
                'description' => 'Campus tour guide needed for new students. Show them around campus, explain facilities, and answer questions. Good communication skills required.',
                'price' => 10000,
                'category' => 'jobs',
                'location' => 'Campus - Main Gate',
                'contact' => '08167890123',
                'images' => ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop']
            ],

            // Additional Electronics
            [
                'title' => 'Dell Inspiron Laptop - 8GB RAM, 256GB SSD',
                'description' => 'Dell Inspiron 15 3000 series laptop. Perfect for programming and general use. Windows 10, Intel i5 processor. Good condition, used for 1 year.',
                'price' => 180000,
                'category' => 'for-sale',
                'location' => 'Off Campus - Abraka',
                'contact' => '08178901234',
                'images' => ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'JBL Bluetooth Speaker - Portable',
                'description' => 'JBL Flip 5 portable Bluetooth speaker. Waterproof, excellent sound quality. Used for 6 months, still under warranty. Perfect for parties and outdoor activities.',
                'price' => 25000,
                'category' => 'for-sale',
                'location' => 'Campus - Student Union',
                'contact' => '08189012345',
                'images' => ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Gaming Mouse - Logitech G502',
                'description' => 'Logitech G502 Hero gaming mouse. RGB lighting, programmable buttons, perfect for gaming and productivity. Used for 3 months, excellent condition.',
                'price' => 15000,
                'category' => 'for-sale',
                'location' => 'Campus - Computer Lab',
                'contact' => '08190123456',
                'images' => ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop']
            ],

            // More Textbooks
            [
                'title' => 'Principles of Economics - Mankiw 8th Edition',
                'description' => 'Principles of Economics textbook by Gregory Mankiw, 8th edition. Essential for economics students. Good condition with some highlighting.',
                'price' => 20000,
                'category' => 'for-sale',
                'location' => 'Campus - Economics Department',
                'contact' => '08201234567',
                'images' => ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Database System Concepts - 7th Edition',
                'description' => 'Database System Concepts by Silberschatz, Korth, and Sudarshan. 7th edition. Perfect for computer science students studying databases.',
                'price' => 16000,
                'category' => 'for-sale',
                'location' => 'Campus - Library',
                'contact' => '08212345678',
                'images' => ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Physics for Scientists and Engineers - Serway',
                'description' => 'Physics for Scientists and Engineers by Serway and Jewett. 10th edition. Used for PHY 101 and PHY 102. Good condition with some notes.',
                'price' => 22000,
                'category' => 'for-sale',
                'location' => 'Campus - Physics Department',
                'contact' => '08223456789',
                'images' => ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop']
            ],

            // Clothing and Accessories
            [
                'title' => 'Designer Backpack - Nike',
                'description' => 'Nike backpack, perfect for campus use. Multiple compartments, laptop sleeve, water bottle holder. Used for 1 year, still in good condition.',
                'price' => 12000,
                'category' => 'for-sale',
                'location' => 'Campus - Main Gate',
                'contact' => '08234567890',
                'images' => ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Casual Shirts - Size M',
                'description' => '3 casual shirts, size medium. Different colors, perfect for daily wear. Barely used, still look new. Selling as a bundle.',
                'price' => 5000,
                'category' => 'for-sale',
                'location' => 'Off Campus - Abraka',
                'contact' => '08245678901',
                'images' => ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Wristwatch - Casio Digital',
                'description' => 'Casio digital wristwatch with stopwatch, alarm, and backlight. Water resistant, perfect for students. Used for 6 months.',
                'price' => 8000,
                'category' => 'for-sale',
                'location' => 'Campus - Sports Complex',
                'contact' => '08256789012',
                'images' => ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop']
            ],

            // More Hostels
            [
                'title' => 'Self-Contained Room - Near Campus',
                'description' => 'Self-contained room available for rent. 3 minutes walk to campus. Includes bed, wardrobe, study table, fan, and private bathroom. Generator available.',
                'price' => 35000,
                'category' => 'hostels',
                'location' => 'Off Campus - Abraka',
                'contact' => '08267890123',
                'images' => ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Roommate Wanted - 2-Bedroom Apartment',
                'description' => 'Looking for a responsible roommate to share 2-bedroom apartment. Furnished, WiFi, generator, security. Close to campus and market. Female preferred.',
                'price' => 20000,
                'category' => 'hostels',
                'location' => 'Off Campus - Abraka',
                'contact' => '08278901234',
                'images' => ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Hostel Room - Campus Area',
                'description' => 'Single room in shared hostel. 5 minutes walk to campus. Shared kitchen and bathroom. Includes bed, wardrobe, and fan. Generator available.',
                'price' => 18000,
                'category' => 'hostels',
                'location' => 'Off Campus - Abraka',
                'contact' => '08289012345',
                'images' => ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
            ],

            // More Services
            [
                'title' => 'Graphic Design Services',
                'description' => 'Professional graphic design services. Logos, flyers, posters, social media graphics. Portfolio available. Affordable rates for students.',
                'price' => 25000,
                'category' => 'services',
                'location' => 'Campus - Art Department',
                'contact' => '08290123456',
                'images' => ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Assignment Writing Help',
                'description' => 'Professional assignment writing help for various subjects. Research, writing, editing, and proofreading. Confidential and timely delivery.',
                'price' => 5000,
                'category' => 'services',
                'location' => 'Campus - Library',
                'contact' => '08301234567',
                'images' => ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Mobile Phone Repair',
                'description' => 'Professional mobile phone repair services. Screen replacement, battery change, software issues, water damage. Quick and reliable service.',
                'price' => 10000,
                'category' => 'services',
                'location' => 'Off Campus - Abraka Market',
                'contact' => '08312345678',
                'images' => ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Hair Styling Services',
                'description' => 'Professional hair styling services for ladies. Braiding, weaving, natural hair care, and styling. Home service available. Affordable rates.',
                'price' => 8000,
                'category' => 'services',
                'location' => 'Off Campus - Abraka',
                'contact' => '08323456789',
                'images' => ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop']
            ],

            // More Jobs
            [
                'title' => 'Cafeteria Assistant - Part-time',
                'description' => 'Part-time cafeteria assistant needed. Help with food preparation, serving, and cleaning. Flexible hours, perfect for students. No experience required.',
                'price' => 15000,
                'category' => 'jobs',
                'location' => 'Campus - Cafeteria',
                'contact' => '08334567890',
                'images' => ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Library Assistant - Weekend',
                'description' => 'Weekend library assistant needed. Help students find books, maintain order, and assist with basic queries. Quiet environment, perfect for studying.',
                'price' => 12000,
                'category' => 'jobs',
                'location' => 'Campus - Library',
                'contact' => '08345678901',
                'images' => ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Event Usher - Campus Events',
                'description' => 'Event usher needed for campus events and ceremonies. Guide guests, distribute materials, and maintain order. Flexible schedule, good communication skills required.',
                'price' => 8000,
                'category' => 'jobs',
                'location' => 'Campus - Event Center',
                'contact' => '08356789012',
                'images' => ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop']
            ],
            [
                'title' => 'Data Entry Clerk - Remote',
                'description' => 'Remote data entry clerk position. Input data into spreadsheets and databases. Flexible hours, work from anywhere. Basic computer skills required.',
                'price' => 18000,
                'category' => 'jobs',
                'location' => 'Remote',
                'contact' => '08367890123',
                'images' => ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop']
            ]
        ];

        // Get user with ID 10 (from token: 10|S30FTBcSadaaiZimlPEZiFririzP3Cbd3TSeYIXVfbf7eac9)
        $testUser = User::find(10);

        if (!$testUser) {
            $this->command->error('❌ User with ID 10 not found. Creating items for first verified user instead.');
            $testUser = $users->where('is_verified', true)->first() ?? $users->first();
        } else {
            $this->command->info('✅ Found user ID 10: ' . $testUser->email . ' - Assigning all test items to this user');
        }

        // Define statuses to test all actions (only valid DB statuses: active, inactive, sold)
        $statuses = ['active', 'active', 'active', 'active', 'sold', 'sold', 'inactive', 'inactive'];

        $index = 0;
        foreach ($sampleItems as $itemData) {
            // Cycle through different statuses
            $status = $statuses[$index % count($statuses)];

            // Assign all items to test user (ID 10)
            $userId = $testUser->id;

            $item = MarketplaceItem::create([
                'user_id' => $userId,
                'title' => $itemData['title'],
                'description' => $itemData['description'],
                'price' => $itemData['price'],
                'category' => $itemData['category'],
                'location' => $itemData['location'],
                'contact' => $itemData['contact'],
                'status' => $status,
                'images' => $itemData['images'],
                'created_at' => now()->subDays(rand(1, 30)), // Random creation date within last 30 days
            ]);

            // For sold items, add sold_at timestamp (if the field exists)
            if ($status === 'sold') {
                $item->update([
                    'updated_at' => now()->subDays(rand(1, 15)),
                ]);
            }

            $index++;
        }

        // Create a few extra test items for the test user with specific statuses for testing
        $extraTestItems = [
            [
                'title' => '[TEST] Active Product - For Edit/Boost',
                'description' => 'This is a test active product. You can test Edit, Boost, Mark as Sold, and Delete actions on this item.',
                'price' => 50000,
                'category' => 'for-sale',
                'location' => 'Campus - Test Location',
                'contact' => $testUser->phone ?? '08012345678',
                'status' => 'active',
                'images' => ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
            ],
            [
                'title' => '[TEST] Another Active Product - For Boost Test',
                'description' => 'This is another test active product with good price for boosting. Test the Boost feature (requires wallet balance).',
                'price' => 75000,
                'category' => 'for-sale',
                'location' => 'Campus - Test Location',
                'contact' => $testUser->phone ?? '08012345678',
                'status' => 'active',
                'images' => ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
            ],
            [
                'title' => '[TEST] Sold Product - For Repost/Delete',
                'description' => 'This is a test sold product. You can test Repost and Delete actions on this item.',
                'price' => 40000,
                'category' => 'for-sale',
                'location' => 'Campus - Test Location',
                'contact' => $testUser->phone ?? '08012345678',
                'status' => 'sold',
                'images' => ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
            ],
            [
                'title' => '[TEST] Inactive Product - For Repost/Edit/Delete',
                'description' => 'This is a test inactive product. You can test Repost, Edit, and Delete actions on this item.',
                'price' => 35000,
                'category' => 'for-sale',
                'location' => 'Campus - Test Location',
                'contact' => $testUser->phone ?? '08012345678',
                'status' => 'inactive',
                'images' => ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
            ],
        ];

        foreach ($extraTestItems as $extraItem) {
            MarketplaceItem::create([
                'user_id' => $testUser->id,
                'title' => $extraItem['title'],
                'description' => $extraItem['description'],
                'price' => $extraItem['price'],
                'category' => $extraItem['category'],
                'location' => $extraItem['location'],
                'contact' => $extraItem['contact'],
                'status' => $extraItem['status'],
                'images' => $extraItem['images'],
                'created_at' => now()->subDays(rand(1, 7)),
            ]);
        }

        $this->command->info('✅ Created ' . count($sampleItems) . ' marketplace items with various statuses');
        $this->command->info('✅ Created ' . count($extraTestItems) . ' test items for testing actions');
        $this->command->info('📝 Test user ID: ' . $testUser->id . ' (' . $testUser->email . ')');
        $this->command->info('💡 Login as the test user to see all test items in "My Products" page');
    }
}
