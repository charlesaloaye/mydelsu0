<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('daily_rewards')) {
            return;
        }

        Schema::table('daily_rewards', function (Blueprint $table) {
            if (!Schema::hasColumn('daily_rewards', 'user_id')) {
                $table->unsignedBigInteger('user_id')->after('id');
            }
            if (!Schema::hasColumn('daily_rewards', 'reward_date')) {
                $table->date('reward_date')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('daily_rewards', 'amount')) {
                $table->decimal('amount', 12, 2)->default(0)->after('reward_date');
            }
            if (!Schema::hasColumn('daily_rewards', 'reward_type')) {
                $table->string('reward_type')->default('daily')->after('amount');
            }
            if (!Schema::hasColumn('daily_rewards', 'streak_count')) {
                $table->unsignedInteger('streak_count')->default(0)->after('reward_type');
            }
            if (!Schema::hasColumn('daily_rewards', 'claimed')) {
                $table->boolean('claimed')->default(false)->after('streak_count');
            }
            if (!Schema::hasColumn('daily_rewards', 'claimed_at')) {
                $table->timestamp('claimed_at')->nullable()->after('claimed');
            }

            // Attempt to add unique index; ignore if it already exists (SQLite-safe)
            try {
                // $table->unique(['user_id', 'reward_date']);
                // Add unique index only if it doesn't exist
                if (!DB::select("SHOW INDEX FROM daily_rewards WHERE Key_name = 'daily_rewards_user_id_reward_date_unique'")) {
                    $table->unique(['user_id', 'reward_date']);
                }
            } catch (\Throwable $e) {
                // Index may already exist; ignore for idempotency
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('daily_rewards')) {
            return;
        }

        Schema::table('daily_rewards', function (Blueprint $table) {
            if (Schema::hasColumn('daily_rewards', 'claimed_at')) {
                $table->dropColumn('claimed_at');
            }
            if (Schema::hasColumn('daily_rewards', 'claimed')) {
                $table->dropColumn('claimed');
            }
            if (Schema::hasColumn('daily_rewards', 'streak_count')) {
                $table->dropColumn('streak_count');
            }
            if (Schema::hasColumn('daily_rewards', 'reward_type')) {
                $table->dropColumn('reward_type');
            }
            if (Schema::hasColumn('daily_rewards', 'amount')) {
                $table->dropColumn('amount');
            }
            if (Schema::hasColumn('daily_rewards', 'reward_date')) {
                $table->dropColumn('reward_date');
            }
            if (Schema::hasColumn('daily_rewards', 'user_id')) {
                $table->dropColumn('user_id');
            }

            // Drop unique if exists
            try {
                $table->dropUnique('daily_rewards_user_id_reward_date_unique');
            } catch (\Throwable $e) {
                // ignore
            }
        });
    }
};
