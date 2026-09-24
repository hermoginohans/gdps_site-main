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
        if (! Schema::hasTable('discounts') || Schema::hasColumn('discounts', 'minimum_spend')) {
            return;
        }

        Schema::table('discounts', function (Blueprint $table) {
            $table->decimal('minimum_spend', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('discounts') || ! Schema::hasColumn('discounts', 'minimum_spend')) {
            return;
        }

        Schema::table('discounts', function (Blueprint $table) {
            $table->dropColumn('minimum_spend');
        });
    }
};
