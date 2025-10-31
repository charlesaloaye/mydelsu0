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
        Schema::create('user_purchased_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignUuid('ticket_id')->constrained('event_tickets')->onDelete('cascade');
            $table->decimal('price_paid', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('total_amount', 10, 2);
            $table->string('ticket_code')->unique(); // Unique ticket code for QR verification
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'refunded'])->default('confirmed');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null'); // Reference to transaction record
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['event_id']);
            $table->index(['ticket_id']);
            $table->index(['ticket_code']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_purchased_tickets');
    }
};
