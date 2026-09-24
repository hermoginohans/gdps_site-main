<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_admin')->default(false);
            $table->unsignedBigInteger('loyalty_points')->default(0);
        });
        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->json('data');
            $table->timestamps();
        });
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->string('number')->unique();
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('amount_centavos');
            $table->json('details');
            $table->timestamps();
        });
        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('reference')->unique();
            $table->string('method');
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('amount_centavos');
            $table->timestamps();
        });
        Schema::create('wallet_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('reference')->unique();
            $table->bigInteger('amount_centavos');
            $table->string('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_entries');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['is_admin', 'loyalty_points']);
        });
    }
};
