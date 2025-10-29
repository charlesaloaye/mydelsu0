<?php

use App\Models\User;
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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_code');
            $table->integer('level');
            $table->integer('credit_unit');
            $table->integer('semester');
            $table->integer('score');
            $table->string('grade');
            $table->decimal('points', 4, 2);
            $table->softDeletes(); // Soft delete support
            $table->foreignIdFor(User::class);
            $table->timestamps();
            $table->unique(['course_code', 'level', 'semester', 'user_id'], 'unique_course_per_user'); // Ensure unique course per user});
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
