<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\ClientIp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class IpBanTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_records_only_successful_ip(): void
    {
        config(['services.railway.ingress' => false]);
        $user = User::factory()->create(['password' => bcrypt('test-password')]);
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertStatus(422);
        $this->assertNull($user->fresh()->last_login_ip);
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'test-password'])->assertOk();
        $this->assertSame('203.0.113.10', $user->fresh()->last_login_ip);
    }

    public function test_bans_require_admin_prevent_self_ban_and_block_existing_sessions(): void
    {
        config(['services.railway.ingress' => false]);
        $user = User::factory()->create();
        $this->putJson('/api/admin/ip-bans', ['ip' => '203.0.113.20', 'banned' => true])->assertUnauthorized();
        $this->actingAs($user)->putJson('/api/admin/ip-bans', ['ip' => '203.0.113.20', 'banned' => true])->assertForbidden();
        $user->forceFill(['is_admin' => true])->save();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])->putJson('/api/admin/ip-bans', ['ip' => '203.0.113.10', 'banned' => true])->assertStatus(422);
        $this->putJson('/api/admin/ip-bans', ['ip' => 'bad', 'banned' => true])->assertStatus(422);
        $this->putJson('/api/admin/ip-bans', ['ip' => '203.0.113.20', 'banned' => true])->assertOk();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.20'])->getJson('/api/user')->assertForbidden();
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertForbidden();
        $this->postJson('/api/register', [])->assertForbidden();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])->putJson('/api/admin/ip-bans', ['ip' => '203.0.113.20', 'banned' => false])->assertOk();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.20'])->getJson('/api/user')->assertOk();
        $this->assertDatabaseCount('ip_bans', 0);
    }

    public function test_forwarded_headers_are_only_used_on_railway(): void
    {
        $request = Request::create('/', 'GET', [], [], [], ['REMOTE_ADDR' => '203.0.113.10', 'HTTP_X_REAL_IP' => '203.0.113.20']);
        config(['services.railway.ingress' => false]);
        $this->assertSame('203.0.113.10', ClientIp::get($request));
        config(['services.railway.ingress' => true]);
        $this->assertSame('203.0.113.20', ClientIp::get($request));
    }
}
