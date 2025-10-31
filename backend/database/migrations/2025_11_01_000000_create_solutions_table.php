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
        Schema::create('solutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('past_question_id')->nullable()->constrained('past_questions')->onDelete('set null');
            $table->string('course_code');
            $table->string('course_title');
            $table->enum('level', ['100', '200', '300', '400', '500']);
            $table->enum('semester', ['1', '2']);
            $table->string('session');
            $table->string('department')->nullable();
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->bigInteger('file_size');
            $table->string('file_type')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->decimal('rating', 3, 2)->default(0)->nullable(); // Average rating (e.g., 4.75)
            $table->integer('rating_count')->default(0); // Number of ratings
            $table->integer('view_count')->default(0);
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solutions');
    }
};
