<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StreamerCodeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        return response()->json([
            'codes' => DB::table('streamer_codes')->latest('id')->get(),
            'streamers' => DB::table('users')->where('is_streamer', true)->where('is_disabled', false)->orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function save(Request $request, ?int $id = null): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        if ($id !== null) {
            abort_unless(DB::table('streamer_codes')->where('id', $id)->exists(), 404);
        }
        $request->merge(['code' => strtoupper(trim((string) $request->input('code')))]);
        $data = $request->validate([
            'code' => ['required', 'regex:/^[A-Z0-9_-]{2,40}$/', Rule::unique('streamer_codes')->ignore($id)],
            'streamer' => ['required', 'string', 'max:200'],
            'type' => ['required', Rule::in(['percent', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0.01', 'decimal:0,2', 'max:'.($request->input('type') === 'percent' ? '100' : '1000000')],
            'minimum' => ['required', 'numeric', 'min:0', 'max:1000000', 'decimal:0,2'],
            'expires_at' => ['nullable', 'date_format:Y-m-d'],
            'active' => ['required', 'boolean'],
        ]);
        $data['updated_at'] = now();
        if ($id !== null) {
            DB::table('streamer_codes')->where('id', $id)->update($data);
        } else {
            $id = DB::table('streamer_codes')->insertGetId($data + ['created_at' => now()]);
        }

        return response()->json(['id' => $id], $request->isMethod('post') ? 201 : 200);
    }

    public function quote(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:40'], 'slug' => ['required', 'string', 'max:200'], 'package_id' => ['required', 'string', 'max:100']]);
        $code = DB::table('streamer_codes')->where('code', strtoupper(trim($data['code'])))->where('active', true)->first();
        abort_unless($code && (! $code->expires_at || $code->expires_at >= now('Asia/Manila')->toDateString()), 422, 'Streamer code is invalid or expired.');
        $product = DB::table('products')->where('slug', $data['slug'])->first();
        $packages = $product ? (json_decode($product->data, true)['packages'] ?? []) : [];
        $package = collect($packages)->firstWhere('id', $data['package_id']);
        abort_unless($package, 422, 'Select a saved game package to use a streamer code.');
        $subtotal = (int) round($package['price'] * 100);
        abort_if($subtotal < (int) round($code->minimum * 100), 422, 'This code requires a minimum spend of PHP '.number_format($code->minimum, 2).'.');
        $discount = $code->type === 'percent' ? (int) round($subtotal * $code->value / 100) : (int) round($code->value * 100);

        return response()->json(['code' => $code->code, 'discountPhp' => min($subtotal, $discount) / 100]);
    }
}
