<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class DemoOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_records_are_scoped_idempotent_and_separate_from_sales(): void
    {
        $data = ['request_id' => (string) Str::uuid(), 'game' => 'Test', 'package' => '100 Diamonds', 'quantity' => 2, 'unit_centavos' => 10000, 'payment' => 'GCash', 'coupon' => 'DEMO10', 'account' => ['uid' => 'demo123']];
        $this->postJson('/api/demo-orders', $data)->assertUnauthorized();
        $owner = User::factory()->create();
        $this->actingAs($owner)->postJson('/api/demo-orders', $data)->assertCreated();
        $this->postJson('/api/demo-orders', $data)->assertCreated();
        $this->assertDatabaseCount('demo_orders', 1);
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('payments', 0);
        $this->getJson('/api/demo-orders')->assertJsonCount(1, 'orders')->assertJsonPath('orders.0.details.total_centavos', 18000);
        $other = User::factory()->create();
        $this->actingAs($other)->getJson('/api/demo-orders')->assertJsonCount(0, 'orders');
        $this->getJson('/api/demo-orders?admin=1')->assertForbidden();
        $other->forceFill(['is_admin' => true])->save();
        $this->getJson('/api/demo-orders?admin=1')->assertJsonCount(1, 'orders');
    }
}
