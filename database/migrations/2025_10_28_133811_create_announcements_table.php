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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('type')->default('info'); // info, warning, important, success
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->string('target_audience')->default('all'); // all, students, staff, specific_department
            $table->string('department')->nullable(); // specific department if target_audience is specific_department
            $table->string('level')->nullable(); // specific level if applicable
            $table->boolean('is_active')->default(true);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('publish_at')->nullable(); // schedule announcement
            $table->timestamp('expires_at')->nullable(); // auto-expire announcement
            $table->string('image_url')->nullable(); // optional image
            $table->json('attachments')->nullable(); // file attachments
            $table->unsignedBigInteger('created_by'); // admin who created the announcement
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index(['is_active', 'publish_at']);
            $table->index(['target_audience', 'department']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
