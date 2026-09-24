<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admin_can_manage_popup_and_disabled_content_is_private(): void
    {
        $this->getJson('/api/promotion')->assertOk()->assertJsonPath('promotion', null);
        $this->putJson('/api/admin/promotion', [])->assertUnauthorized();
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/admin/promotion', [])->assertForbidden();
        $user->forceFill(['is_admin' => true])->save();
        $data = ['enabled' => true, 'title' => 'Weekend offer', 'button_label' => 'Shop', 'button_url' => 'https://example.com/games'];
        $revision = $this->putJson('/api/admin/promotion', $data)->assertOk()->json('promotion.revision');
        $this->getJson('/api/promotion')->assertJsonPath('promotion.title', 'Weekend offer');
        $data['enabled'] = false;
        $next = $this->putJson('/api/admin/promotion', $data)->assertOk()->json('promotion.revision');
        $this->assertNotSame($revision, $next);
        $this->getJson('/api/promotion')->assertJsonPath('promotion', null);
        $this->getJson('/api/admin/promotion')->assertJsonPath('promotion.title', 'Weekend offer');
        $data['button_url'] = 'javascript:alert(1)';
        $this->putJson('/api/admin/promotion', $data)->assertUnprocessable();
    }
}
