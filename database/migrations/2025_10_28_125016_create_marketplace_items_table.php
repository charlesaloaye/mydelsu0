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
        Schema::create('marketplace_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->enum('category', ['for-sale', 'hostels', 'services', 'jobs']);
            $table->string('location');
            $table->string('contact');
            $table->enum('status', ['active', 'inactive', 'sold'])->default('active');
            $table->json('images')->nullable();
            $table->timestamps();

            $table->index(['category', 'status']);
            $table->index(['price']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_items');
    }
};
