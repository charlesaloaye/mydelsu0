<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Attributes\AsSchedule;

#[AsSchedule(frequency: 'everyMinute', withoutOverlapping: true)]
class SendEmails extends Command
{
    protected $signature = 'app:send-emails';
    protected $description = 'Process all queued email jobs and stop when done';

    public function handle(): int
    {
        return $this->call('queue:work', [
            '--stop-when-empty' => true,
        ]);
    }
}
