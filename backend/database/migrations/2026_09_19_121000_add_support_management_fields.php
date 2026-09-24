<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('support_tickets', function (Blueprint $table): void {
            $table->string('priority')->default('normal')->after('status');
            $table->text('admin_note')->nullable()->after('priority');
            $table->text('admin_reply')->nullable()->after('admin_note');
            $table->timestamp('responded_at')->nullable()->after('admin_reply');
        });
    }

    public function down(): void
    {
        Schema::table('support_tickets', function (Blueprint $table): void {
            $table->dropColumn(['priority', 'admin_note', 'admin_reply', 'responded_at']);
        });
    }
};
