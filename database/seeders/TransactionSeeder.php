<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
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

        $transactionTypes = [
            'credit' => [
                'Account funding via bank transfer',
                'Referral bonus - User activated',
                'Daily reward claimed',
                'Past question upload reward',
                'Project upload reward',
                'Hostel upload reward',
                'Contest prize',
                'Admin credit',
            ],
            'debit' => [
                'MTN Airtime - ₦500',
                'Airtel Airtime - ₦1000',
                'Glo Airtime - ₦750',
                '9mobile Airtime - ₦300',
                'MTN Data - 2GB',
                'Airtel Data - 1.5GB',
                'Glo Data - 3GB',
                '9mobile Data - 1GB',
                'Withdrawal to bank account',
                'Hostel booking payment',
                'Course material purchase',
            ]
        ];

        $statuses = ['completed', 'pending', 'failed'];

        foreach ($users as $user) {
            // Create 10-20 transactions per user
            $transactionCount = rand(10, 20);
            
            for ($i = 0; $i < $transactionCount; $i++) {
                $type = array_rand($transactionTypes);
                $description = $transactionTypes[$type][array_rand($transactionTypes[$type])];
                $amount = $type === 'credit' ? rand(100, 10000) / 100 : rand(50, 5000) / 100;
                $status = $statuses[array_rand($statuses)];
                
                // Generate reference
                $reference = strtoupper(substr($type, 0, 3)) . date('Ymd') . rand(1000, 9999);
                
                // Random date within last 30 days
                $createdAt = now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
                
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => $type,
                    'amount' => $amount,
                    'description' => $description,
                    'status' => $status,
                    'reference' => $reference,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

        $this->command->info('Created transactions for ' . $users->count() . ' users.');
    }
}
