<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        return response()->json(['coupons' => DB::table('discounts')->orderByDesc('id')->get()]);
    }

    public function save(Request $request, ?int $id = null): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        if ($id !== null) {
            abort_unless(DB::table('discounts')->where('id', $id)->exists(), 404);
        }
        $request->merge(['code' => strtoupper(trim((string) $request->input('code')))]);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'alpha_dash:ascii', 'max:10', Rule::unique('discounts', 'code')->ignore($id)],
            'disc_type' => ['required', Rule::in(['percentage', 'nominal'])],
            'nominal' => ['required', 'numeric', 'gt:0', $request->input('disc_type') === 'percentage' ? 'max:100' : 'max:1000000'],
            'minimum_spend' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'maximum' => ['required', 'integer', 'min:1', 'max:100000000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['required', 'boolean'],
        ]);
        $data['start_date'] = Carbon::parse($data['start_date'])->format('Y-m-d H:i:s');
        $data['end_date'] = Carbon::parse($data['end_date'])->format('Y-m-d H:i:s');
        $data['updated_at'] = now();
        if ($id !== null) {
            DB::table('discounts')->where('id', $id)->update($data);
        } else {
            $id = DB::table('discounts')->insertGetId($data + ['product_type' => 'all', 'used' => 0, 'created_at' => now()]);
        }

        return response()->json(['id' => $id]);
    }

    public function quote(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:10'], 'slug' => ['required', 'regex:/^[A-Za-z0-9_-]+$/'], 'item_id' => ['required', 'integer', 'min:1']]);
        $coupon = DB::table('discounts')->where('code', strtoupper(trim($data['code'])))->where('is_active', 1)->where('start_date', '<=', now())->where('end_date', '>=', now())->first();
        abort_unless($coupon && $coupon->used < $coupon->maximum, 422, 'Coupon is invalid, expired, or fully used.');
        $response = app(StoreController::class)->productDetails($data['slug']);
        if ($response->getStatusCode() !== 200) {
            return $response;
        }
        $product = $response->getData(true)['product'];
        $item = collect($product['packages'])->firstWhere('id', (string) $data['item_id']);
        abort_unless($item && $item['stock'] !== 0, 422, 'This package is unavailable.');
        if ($coupon->product_type !== 'all') {
            $type = $coupon->product_type === 'product_item' ? 'App\\Models\\ProductItem' : 'App\\Models\\Product';
            $target = $coupon->product_type === 'product_item' ? $data['item_id'] : $product['id'];
            abort_unless(DB::table('discount_product')->where('discount_id', $coupon->id)->where('productable_type', $type)->where('productable_id', $target)->exists(), 422, 'Coupon does not apply to this package.');
        }
        $subtotal = (int) round($item['price'] * 100);
        abort_if($subtotal < (int) round($coupon->minimum_spend * 100), 422, 'The minimum spend for this coupon has not been reached.');
        $discount = min($subtotal, max(0, (int) round($coupon->disc_type === 'percentage' ? $subtotal * $coupon->nominal / 100 : $coupon->nominal * 100)));

        return response()->json(['code' => $coupon->code, 'subtotalCentavos' => $subtotal, 'discountCentavos' => $discount, 'totalCentavos' => $subtotal - $discount]);
    }
}
