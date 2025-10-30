<?php

namespace Database\Seeders;

use App\Models\CourseSummary;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSummarySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        CourseSummary::factory()
            ->count(30)
            ->create([
                'user_id' => $user->id,
                'status' => 'approved',
            ]);

        // Some pending ones
        CourseSummary::factory()
            ->count(10)
            ->create([
                'user_id' => $user->id,
                'status' => 'pending',
            ]);
    }
}
