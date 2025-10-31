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
        Schema::create('gpa_calculations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('semester');
            $table->string('academic_year');
            $table->json('courses'); // Store course data as JSON
            $table->decimal('total_credit_hours', 5, 2);
            $table->decimal('total_grade_points', 8, 2);
            $table->decimal('gpa', 3, 2);
            $table->string('grade_scale', 10)->default('4.0'); // 4.0, 5.0, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gpa_calculations');
    }
};
