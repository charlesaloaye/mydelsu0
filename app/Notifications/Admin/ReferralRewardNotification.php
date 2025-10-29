<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class ReferralRewardNotification extends Notification
{
    use Queueable;

    public $newUser;

    public function __construct($newUser)
    {
        $this->newUser = $newUser;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // optionally SMS
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Referral Reward Earned!')
            ->greeting('Congratulations 🎉')
            ->line("{$this->newUser->first_name} {$this->newUser->last_name} just joined and activated their account.")
            ->line("₦100 has been added to your wallet.")
            ->action('Check Dashboard', url('/dashboard'));
    }
}
