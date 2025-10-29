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
        // Create a new table with UUID
        Schema::create('marketplace_items_new', function (Blueprint $table) {
            $table->uuid('id')->primary();
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

        // Copy data from old table to new table
        $items = DB::table('marketplace_items')->get();
        foreach ($items as $item) {
            DB::table('marketplace_items_new')->insert([
                'id' => Str::uuid()->toString(),
                'user_id' => $item->user_id,
                'title' => $item->title,
                'description' => $item->description,
                'price' => $item->price,
                'category' => $item->category,
                'location' => $item->location,
                'contact' => $item->contact,
                'status' => $item->status,
                'images' => $item->images,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ]);
        }

        // Drop old table and rename new table
        Schema::dropIfExists('marketplace_items');
        Schema::rename('marketplace_items_new', 'marketplace_items');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Create a new table with auto-incrementing ID
        Schema::create('marketplace_items_old', function (Blueprint $table) {
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

        // Copy data from UUID table to new table
        $items = DB::table('marketplace_items')->get();
        foreach ($items as $item) {
            DB::table('marketplace_items_old')->insert([
                'user_id' => $item->user_id,
                'title' => $item->title,
                'description' => $item->description,
                'price' => $item->price,
                'category' => $item->category,
                'location' => $item->location,
                'contact' => $item->contact,
                'status' => $item->status,
                'images' => $item->images,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ]);
        }

        // Drop UUID table and rename old table
        Schema::dropIfExists('marketplace_items');
        Schema::rename('marketplace_items_old', 'marketplace_items');
    }
};
