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
        Schema::create('daily_rewards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->date('reward_date');
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('reward_type')->default('daily');
            $table->unsignedInteger('streak_count')->default(0);
            $table->boolean('claimed')->default(false);
            $table->timestamp('claimed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'reward_date']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_rewards');
    }
};
