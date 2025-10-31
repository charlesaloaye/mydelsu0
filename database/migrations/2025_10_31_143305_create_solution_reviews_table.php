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
        Schema::create('solution_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('solution_id')->constrained('solutions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->default(1); // 1-5 stars
            $table->text('review')->nullable();
            $table->timestamps();

            // Ensure one review per user per solution
            $table->unique(['solution_id', 'user_id']);
            $table->index(['solution_id']);
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solution_reviews');
    }
};
