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
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('status');
            }

            if (!Schema::hasColumn('transactions', 'metadata')) {
                $table->text('metadata')->nullable()->after('reference');
            }

            // Some controllers use 'narration'. Existing migration added 'naration' (typo).
            // Add the correctly spelled column to avoid runtime errors.
            if (!Schema::hasColumn('transactions', 'narration')) {
                $table->text('narration')->nullable()->after('metadata');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (Schema::hasColumn('transactions', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
            if (Schema::hasColumn('transactions', 'metadata')) {
                $table->dropColumn('metadata');
            }
            if (Schema::hasColumn('transactions', 'narration')) {
                $table->dropColumn('narration');
            }
        });
    }
};
