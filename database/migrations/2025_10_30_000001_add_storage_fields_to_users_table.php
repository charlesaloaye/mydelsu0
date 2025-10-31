<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('storage_quota_bytes')->default(52428800)->after('balance');
            $table->unsignedBigInteger('storage_used_bytes')->default(0)->after('storage_quota_bytes');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['storage_quota_bytes', 'storage_used_bytes']);
        });
    }
};
