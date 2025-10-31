<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TransactionSeeder::class,
            NotificationSeeder::class,
            MarketplaceItemSeeder::class,
            HostelSeeder::class,
            EventSeeder::class,
            AnnouncementSeeder::class,
            PastQuestionSeeder::class,
            CourseSummarySeeder::class,
        ]);
    }
}
