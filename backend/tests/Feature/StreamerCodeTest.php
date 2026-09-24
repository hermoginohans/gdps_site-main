<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class StreamerCodeTest extends TestCase
{
    use RefreshDatabase;

    public function test_codes_are_admin_managed_and_quotes_use_saved_prices(): void
    {
        $payload = ['code' => 'TEST5', 'streamer' => 'Test', 'type' => 'percent', 'value' => 5, 'minimum' => 100, 'expires_at' => null, 'active' => true];
        $this->postJson('/api/admin/streamer-codes', $payload)->assertUnauthorized();
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/admin/streamer-codes', $payload)->assertForbidden();
        $user->forceFill(['is_admin' => true])->save();
        $id = $this->postJson('/api/admin/streamer-codes', $payload)->assertCreated()->json('id');
        $this->postJson('/api/admin/streamer-codes', $payload)->assertUnprocessable();
        DB::table('products')->insert(['slug' => 'test', 'data' => json_encode(['packages' => [['id' => 'pack', 'price' => 200]]]), 'created_at' => now(), 'updated_at' => now()]);
        $quote = ['code' => 'test5', 'slug' => 'test', 'package_id' => 'pack', 'price' => 1];
        $this->postJson('/api/streamer-codes/quote', $quote)->assertOk()->assertJsonPath('discountPhp', 10);
        $this->putJson('/api/admin/streamer-codes/'.$id, array_merge($payload, ['minimum' => 300]))->assertOk();
        $this->postJson('/api/streamer-codes/quote', $quote)->assertUnprocessable();
        $this->putJson('/api/admin/streamer-codes/'.$id, array_merge($payload, ['active' => false]))->assertOk();
        $this->postJson('/api/streamer-codes/quote', $quote)->assertUnprocessable();
    }
}
