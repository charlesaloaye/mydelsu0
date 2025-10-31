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
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->text('amenities')->nullable()->after('contact');
            $table->enum('availability', ['available', 'not_available', 'coming_soon'])->default('available')->after('amenities');
            $table->enum('room_type', ['single', 'shared', 'self_contained'])->nullable()->after('availability');
            $table->enum('gender', ['male', 'female', 'mixed'])->default('mixed')->after('room_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropColumn(['amenities', 'availability', 'room_type', 'gender']);
        });
    }
};
