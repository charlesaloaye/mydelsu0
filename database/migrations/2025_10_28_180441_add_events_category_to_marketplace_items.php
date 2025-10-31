<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add event-specific fields
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->date('event_date')->nullable()->after('contact');
            $table->time('event_time')->nullable()->after('event_date');
            $table->string('event_type')->nullable()->after('event_time'); // conference, workshop, party, etc.
            $table->integer('max_attendees')->nullable()->after('event_type');
            $table->integer('current_attendees')->default(0)->after('max_attendees');
        });

        // For SQLite, we need to recreate the table to modify the enum
        // This is a workaround since SQLite doesn't support MODIFY COLUMN
        if (DB::getDriverName() === 'sqlite') {
            // Create a new table with the updated enum
            Schema::create('marketplace_items_temp', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('title');
                $table->text('description');
                $table->decimal('price', 10, 2);
                $table->enum('category', ['for-sale', 'hostels', 'services', 'jobs', 'events']);
                $table->string('location');
                $table->string('contact');
                $table->enum('status', ['active', 'inactive', 'sold'])->default('active');
                $table->json('images')->nullable();
                $table->text('amenities')->nullable();
                $table->enum('availability', ['available', 'not_available', 'coming_soon'])->default('available');
                $table->enum('room_type', ['single', 'shared', 'self_contained'])->nullable();
                $table->enum('gender', ['male', 'female', 'mixed'])->default('mixed');
                $table->date('event_date')->nullable();
                $table->time('event_time')->nullable();
                $table->string('event_type')->nullable();
                $table->integer('max_attendees')->nullable();
                $table->integer('current_attendees')->default(0);
                $table->timestamps();

                $table->index(['category', 'status']);
                $table->index(['price']);
                $table->index(['created_at']);
            });

            // Copy data from old table to new table
            $items = DB::table('marketplace_items')->get();
            foreach ($items as $item) {
                DB::table('marketplace_items_temp')->insert([
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'price' => $item->price,
                    'category' => $item->category,
                    'location' => $item->location,
                    'contact' => $item->contact,
                    'status' => $item->status,
                    'images' => $item->images,
                    'amenities' => $item->amenities ?? null,
                    'availability' => $item->availability ?? 'available',
                    'room_type' => $item->room_type ?? null,
                    'gender' => $item->gender ?? 'mixed',
                    'event_date' => null,
                    'event_time' => null,
                    'event_type' => null,
                    'max_attendees' => null,
                    'current_attendees' => 0,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ]);
            }

            // Drop old table and rename new table
            Schema::dropIfExists('marketplace_items');
            Schema::rename('marketplace_items_temp', 'marketplace_items');
        } else {
            // For other databases, use MODIFY COLUMN
            DB::statement("ALTER TABLE marketplace_items MODIFY COLUMN category ENUM('for-sale', 'hostels', 'services', 'jobs', 'events') NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove event-specific fields
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropColumn(['event_date', 'event_time', 'event_type', 'max_attendees', 'current_attendees']);
        });

        // Remove 'events' from the category enum
        DB::statement("ALTER TABLE marketplace_items MODIFY COLUMN category ENUM('for-sale', 'hostels', 'services', 'jobs') NOT NULL");
    }
};
