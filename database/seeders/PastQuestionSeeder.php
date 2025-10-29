<?php

namespace Database\Seeders;

use App\Models\PastQuestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class PastQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        PastQuestion::factory()
            ->count(30)
            ->create([
                'user_id' => $user->id,
                'status' => 'approved',
            ]);

        // Some pending ones
        PastQuestion::factory()
            ->count(10)
            ->create([
                'user_id' => $user->id,
                'status' => 'pending',
            ]);
    }
}
