<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a new table with UUID as primary key
        Schema::create('solutions_new', function (Blueprint $table) {
            $table->uuid('id')->primary();
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
            $table->decimal('rating', 3, 2)->default(0)->nullable();
            $table->integer('rating_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('download_count')->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['status']);
            $table->index(['course_code']);
        });

        // Copy data from old table to new table
        $solutions = DB::table('solutions')->get();
        foreach ($solutions as $solution) {
            DB::table('solutions_new')->insert([
                'id' => Str::uuid()->toString(),
                'user_id' => $solution->user_id,
                'past_question_id' => $solution->past_question_id,
                'course_code' => $solution->course_code,
                'course_title' => $solution->course_title,
                'level' => $solution->level,
                'semester' => $solution->semester,
                'session' => $solution->session,
                'department' => $solution->department,
                'description' => $solution->description,
                'file_path' => $solution->file_path,
                'file_name' => $solution->file_name,
                'file_size' => $solution->file_size,
                'file_type' => $solution->file_type,
                'status' => $solution->status,
                'admin_notes' => $solution->admin_notes,
                'rating' => $solution->rating,
                'rating_count' => $solution->rating_count,
                'view_count' => $solution->view_count,
                'download_count' => $solution->download_count,
                'created_at' => $solution->created_at,
                'updated_at' => $solution->updated_at,
            ]);
        }

        // Drop old table and rename new table
        Schema::dropIfExists('solutions');
        Schema::rename('solutions_new', 'solutions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Create a new table with auto-incrementing ID
        Schema::create('solutions_old', function (Blueprint $table) {
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
            $table->decimal('rating', 3, 2)->default(0)->nullable();
            $table->integer('rating_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });

        // Copy data from UUID table to new table
        $solutions = DB::table('solutions')->get();
        foreach ($solutions as $solution) {
            DB::table('solutions_old')->insert([
                'user_id' => $solution->user_id,
                'past_question_id' => $solution->past_question_id,
                'course_code' => $solution->course_code,
                'course_title' => $solution->course_title,
                'level' => $solution->level,
                'semester' => $solution->semester,
                'session' => $solution->session,
                'department' => $solution->department,
                'description' => $solution->description,
                'file_path' => $solution->file_path,
                'file_name' => $solution->file_name,
                'file_size' => $solution->file_size,
                'file_type' => $solution->file_type,
                'status' => $solution->status,
                'admin_notes' => $solution->admin_notes,
                'rating' => $solution->rating,
                'rating_count' => $solution->rating_count,
                'view_count' => $solution->view_count,
                'download_count' => $solution->download_count,
                'created_at' => $solution->created_at,
                'updated_at' => $solution->updated_at,
            ]);
        }

        // Drop UUID table and rename old table
        Schema::dropIfExists('solutions');
        Schema::rename('solutions_old', 'solutions');
    }
};
