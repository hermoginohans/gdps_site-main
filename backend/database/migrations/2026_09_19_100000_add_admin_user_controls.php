<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_affiliate')->default(false);
            $table->boolean('is_streamer')->default(false);
            $table->boolean('is_auction')->default(false);
            $table->boolean('is_disabled')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['is_affiliate', 'is_streamer', 'is_auction', 'is_disabled']);
        });
    }
};
