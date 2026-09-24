<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DB::table('demo_orders');
        if ($request->boolean('admin')) {
            abort_unless($request->user()->is_admin, 403);
        } else {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json(['orders' => $query->latest('id')->limit(100)->get()->map(fn ($row): array => [
            'reference' => $row->reference, 'user_id' => $row->user_id, 'created_at' => $row->created_at,
            'status' => 'demo_completed', 'details' => json_decode($row->data, true),
        ])]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'request_id' => ['required', 'uuid'], 'game' => ['required', 'string', 'max:255'],
            'package' => ['required', 'string', 'max:255'], 'quantity' => ['required', 'integer', 'between:1,99'],
            'unit_centavos' => ['required', 'integer', 'between:0,100000000'],
            'payment' => ['required', 'in:GCash,Maya'], 'coupon' => ['nullable', 'in:DEMO10'],
            'account' => ['present', 'array', 'max:20'], 'account.*' => ['nullable', 'string', 'max:255'],
        ]);
        $requestId = $data['request_id'];
        unset($data['request_id']);
        $data['subtotal_centavos'] = $data['unit_centavos'] * $data['quantity'];
        $data['discount_centavos'] = ($data['coupon'] ?? null) === 'DEMO10' ? (int) round($data['subtotal_centavos'] * 0.1) : 0;
        $data['total_centavos'] = $data['subtotal_centavos'] - $data['discount_centavos'];
        DB::table('demo_orders')->insertOrIgnore([
            'user_id' => $request->user()->id, 'request_id' => $requestId,
            'reference' => 'DEMO-'.Str::uuid(), 'data' => json_encode($data, JSON_THROW_ON_ERROR),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $row = DB::table('demo_orders')->where('request_id', $requestId)->where('user_id', $request->user()->id)->first();
        abort_unless($row, 409, 'Please start a new demo checkout.');

        return response()->json(['reference' => $row->reference, 'status' => 'demo_completed'], 201);
    }
}
