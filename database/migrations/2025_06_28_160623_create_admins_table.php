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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->boolean('is_verified')->default(false);
            $table->string('phone')->nullable();
            $table->bigInteger('balance')->default(0);
            $table->string('dob')->nullable();
            $table->string('picture')->nullable();
            $table->string('matric_num')->nullable();
            $table->string('student_id')->nullable();
            $table->enum('type', ['aspirant', 'student', 'alumni'])->default('aspirant');
            $table->enum('role', ['rep', 'admin', 'staff'])->default('admin');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->softDeletes(); // Soft delete support
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
