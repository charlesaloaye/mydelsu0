<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContestInviteNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Join Our Referral Contest!')
            ->greeting('Hello 🎉')
            ->line('You are now eligible to join the referral contest.')
            ->line('Please contact WhatsApp Admin to activate your contest participation.')
            ->action('View Contest', url('/contest'));
    }
}
