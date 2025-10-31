<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'is_verified',
        'balance',
        'wallet_balance',
        'first_name',
        'last_name',
        'email',
        'phone',
        'whatsapp',
        'dob',
        'picture',
        'avatar',
        'matric_num',
        'student_id',
        'student_id_image',
        'type',
        'role',
        'user_status',
        'referral_code',
        'referral_number',
        'referrer_id',
        'how_did_you_hear',
        'social_media',
        'profile_complete',
        'verification_status',
        'verification_submitted_at',
        'additional_documents',
        'last_login_at',
        'password',
        // Settings fields
        'email_notifications',
        'push_notifications',
        'sms_notifications',
        'marketing_emails',
        'profile_visibility',
        'show_email',
        'show_phone',
        'show_whatsapp',
        'theme',
        'auto_theme',
        'is_active',
        'deactivated_at',
        'storage_quota_bytes',
        'storage_used_bytes',
        'subscription_plan',
        'subscription_expires_at',
    ];


    public function transactions()
    {
        return $this->HasMany(Transaction::class);
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referrer_id');
    }

    public function purchasedTickets()
    {
        return $this->hasMany(PurchasedTicket::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'storage_quota_bytes' => 'integer',
            'storage_used_bytes' => 'integer',
            'subscription_expires_at' => 'datetime',
        ];
    }

    /**
     * Check if user has premium subscription
     */
    public function isPremium(): bool
    {
        if ($this->subscription_plan !== 'premium') {
            return false;
        }

        // If there's no expiration date, it's a lifetime premium
        if ($this->subscription_expires_at === null) {
            return true;
        }

        // Check if subscription hasn't expired
        return $this->subscription_expires_at->isFuture();
    }
}
