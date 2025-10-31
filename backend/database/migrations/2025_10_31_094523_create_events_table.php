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
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('category', ['Academic', 'Social/Parties', 'Sports', 'Career', 'Religious', 'Cultural', 'Entertainment', 'Workshop', 'Other']);
            $table->date('date');
            $table->string('time'); // e.g., "9:00 AM - 5:00 PM"
            $table->string('location');
            $table->json('images')->nullable();
            $table->json('tags')->nullable(); // Array of tags
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->boolean('sponsored')->default(false);
            $table->integer('views')->default(0);
            $table->integer('interested')->default(0);
            $table->integer('tickets_sold')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['category']);
            $table->index(['status']);
            $table->index(['date']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
