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
            $table->decimal('wallet_balance', 10, 2)->default(0)->after('balance');
            $table->string('whatsapp')->nullable()->after('phone');
            $table->string('avatar')->nullable()->after('picture');
            $table->string('student_id_image')->nullable()->after('student_id');
            $table->enum('user_status', ['aspirant', 'current_student', 'alumni'])->nullable()->after('role');
            $table->string('referral_code')->unique()->nullable()->after('user_status');
            $table->string('referral_number')->nullable()->after('referral_code');
            $table->string('how_did_you_hear')->nullable()->after('referral_number');
            $table->string('social_media')->nullable()->after('how_did_you_hear');
            $table->integer('profile_complete')->default(0)->after('social_media');
            $table->enum('verification_status', ['not_submitted', 'pending', 'approved', 'rejected'])->default('not_submitted')->after('profile_complete');
            $table->timestamp('verification_submitted_at')->nullable()->after('verification_status');
            $table->json('additional_documents')->nullable()->after('verification_submitted_at');
            $table->timestamp('last_login_at')->nullable()->after('additional_documents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'wallet_balance',
                'whatsapp',
                'avatar',
                'student_id_image',
                'user_status',
                'referral_code',
                'referral_number',
                'how_did_you_hear',
                'social_media',
                'profile_complete',
                'verification_status',
                'verification_submitted_at',
                'additional_documents',
                'last_login_at'
            ]);
        });
    }
};
