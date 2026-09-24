<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('last_login_ip', 45)->nullable();
            $table->timestamp('last_login_at')->nullable();
        });
        Schema::create('ip_bans', function (Blueprint $table): void {
            $table->id();
            $table->string('ip', 45)->unique();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_bans');
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['last_login_ip', 'last_login_at']);
        });
    }
};
