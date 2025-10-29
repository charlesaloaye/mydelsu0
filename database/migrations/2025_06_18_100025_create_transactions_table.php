<?php

use App\Models\User;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class); // user_id
            $table->enum('type', ['credit', 'debit'])->default('credit'); // e.g., 'deposit', 'withdrawal'
            $table->decimal('amount', 10, 2); // Amount of the transaction
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending'); // e.g., 'pending', 'completed', 'failed'
            $table->text('description')->nullable(); // Optional description of the transaction
            $table->text('reference')->nullable(); // Optional reference for the transaction
            $table->timestamps();
            $table->softDeletes(); // Soft delete support
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
