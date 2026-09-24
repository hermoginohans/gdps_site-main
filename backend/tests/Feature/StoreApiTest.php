<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class StoreApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_requires_admin_and_valid_period(): void
    {
        $this->getJson('/api/admin/report?month=9&year=2026')->assertUnauthorized();
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/admin/report?month=9&year=2026')->assertForbidden();
        $user->forceFill(['is_admin' => true])->save();
        $this->getJson('/api/admin/report?month=13&year=2026')->assertUnprocessable();
        DB::table('payments')->insert([
            ['user_id' => $user->id, 'reference' => 'september', 'method' => 'test', 'status' => 'completed', 'amount_centavos' => 12345, 'created_at' => '2026-09-15 00:00:00', 'updated_at' => '2026-09-15 00:00:00'],
            ['user_id' => $user->id, 'reference' => 'october', 'method' => 'test', 'status' => 'completed', 'amount_centavos' => 5000, 'created_at' => '2026-10-01 00:00:00', 'updated_at' => '2026-10-01 00:00:00'],
        ]);
        $this->getJson('/api/admin/report?month=9&year=2026')->assertOk()->assertJsonPath('period.turnoverCentavos', 12345);
    }

    private function product(): array
    {
        return ['name' => 'Test game', 'slug' => 'test-game', 'category' => 'Games', 'picture' => '/games/test.webp', 'description' => 'Test product', 'minPrice' => 100, 'maxPrice' => 200, 'isGiftCard' => false];
    }

    public function test_guests_and_customers_cannot_manage_products(): void
    {
        $this->postJson('/api/admin/products', $this->product())->assertUnauthorized();
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/admin/products', $this->product())->assertForbidden();
        $this->getJson('/api/admin')->assertForbidden();
    }

    public function test_admin_can_create_update_and_publish_products(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();
        $id = $this->actingAs($admin)->postJson('/api/admin/products', $this->product())->assertCreated()->json('id');
        $this->putJson('/api/admin/products/'.$id, array_merge($this->product(), ['name' => 'Updated']))->assertOk();
        $this->getJson('/api/products')->assertJsonPath('products.0.name', 'Updated');
        $this->postJson('/api/admin/products', $this->product())->assertUnprocessable();
        $this->postJson('/api/admin/products', array_merge($this->product(), ['slug' => 'invalid', 'minPrice' => -1]))->assertUnprocessable();
    }

    public function test_customer_wallet_is_scoped_to_owner(): void
    {
        $a = User::factory()->create();
        $b = User::factory()->create();
        DB::table('wallet_entries')->insert(['user_id' => $b->id, 'reference' => 'private', 'amount_centavos' => 12300, 'description' => 'Private credit', 'created_at' => now(), 'updated_at' => now()]);
        $this->actingAs($a)->getJson('/api/account')->assertJsonPath('balanceCentavos', 0)->assertJsonCount(0, 'walletEntries');
    }

    public function test_admin_can_manage_packages_and_prices_are_derived(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();
        $payload = array_merge($this->product(), ['packages' => [
            ['id' => 'small', 'name' => '86 Diamonds', 'price' => 75.50],
            ['id' => 'large', 'name' => '172 Diamonds', 'price' => 150],
        ]]);
        $id = $this->actingAs($admin)->postJson('/api/admin/products', $payload)->assertCreated()->json('id');
        $this->getJson('/api/products')->assertJsonCount(2, 'products.0.packages')->assertJsonPath('products.0.minPrice', 75.5)->assertJsonPath('products.0.maxPrice', 150);
        $payload['packages'][0]['price'] = -1;
        $this->putJson('/api/admin/products/'.$id, $payload)->assertUnprocessable();
        $payload['packages'] = [['id' => 'large', 'name' => 'Weekly Pass', 'price' => 125]];
        $this->putJson('/api/admin/products/'.$id, $payload)->assertOk();
        $this->getJson('/api/products')->assertJsonCount(1, 'products.0.packages')->assertJsonPath('products.0.minPrice', 125)->assertJsonPath('products.0.packages.0.name', 'Weekly Pass');
        $payload['packages'] = [];
        $this->putJson('/api/admin/products/'.$id, $payload)->assertOk();
        $this->getJson('/api/products')->assertJsonCount(0, 'products.0.packages');
    }

    public function test_registration_cannot_grant_admin_access(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000')->postJson('/api/register', ['name' => 'Customer', 'email' => 'customer@example.test', 'password' => 'long-password-123', 'password_confirmation' => 'long-password-123', 'is_admin' => true])->assertCreated()->assertJsonPath('user.isAdmin', false);
    }
}
