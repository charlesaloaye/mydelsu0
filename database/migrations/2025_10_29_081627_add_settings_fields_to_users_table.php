<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Notification preferences
            $table->boolean('email_notifications')->default(true);
            $table->boolean('push_notifications')->default(true);
            $table->boolean('sms_notifications')->default(false);
            $table->boolean('marketing_emails')->default(false);

            // Privacy settings
            $table->enum('profile_visibility', ['public', 'friends', 'private'])->default('public');
            $table->boolean('show_email')->default(false);
            $table->boolean('show_phone')->default(false);
            $table->boolean('show_whatsapp')->default(true);

            // Theme preferences
            $table->enum('theme', ['light', 'dark', 'auto'])->default('light');
            $table->boolean('auto_theme')->default(true);

            // Account status
            $table->boolean('is_active')->default(true);
            $table->timestamp('deactivated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
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
                'deactivated_at'
            ]);
        });
    }
};
