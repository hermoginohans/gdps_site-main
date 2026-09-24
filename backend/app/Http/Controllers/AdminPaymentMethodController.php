<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminPaymentMethodController extends Controller
{
    public function active(): JsonResponse
    {
        $methods = DB::table('payment_methods')
            ->where('is_active', true)
            ->orderBy('ordering')
            ->orderBy('id')
            ->get(['id', 'name', 'slug', 'vendor', 'category', 'currency_code', 'description', 'admin_fee', 'admin_type', 'requires_approval'])
            ->map(function (object $method): object {
                $description = html_entity_decode((string) ($method->description ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $description = preg_replace('/\s+/', ' ', strip_tags($description)) ?? '';
                $method->description = trim($description);

                return $method;
            });

        return response()->json(['methods' => $methods]);
    }

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        return response()->json(['methods' => DB::table('payment_methods')->orderBy('ordering')->orderBy('id')->get(['id', 'name', 'slug', 'vendor', 'category', 'currency_code', 'account_number', 'description', 'admin_fee', 'admin_type', 'is_active', 'requires_approval', 'ordering'])]);
    }

    public function store(Request $request, ?int $id = null): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        if ($id !== null) {
            abort_unless(DB::table('payment_methods')->where('id', $id)->exists(), 404);
        }
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:150', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('payment_methods', 'slug')->ignore($id)],
            'vendor' => ['required', 'string', 'max:50'],
            'category' => ['required', 'string', 'max:100'],
            'currency_code' => ['required', 'regex:/^[A-Z]{3}$/'],
            'account_number' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'admin_type' => ['required', Rule::in(['nominal', 'percentage', 'no-admin'])],
            'admin_fee' => ['required', 'numeric', 'min:0', $request->input('admin_type') === 'percentage' ? 'max:100' : 'max:1000000'],
            'is_active' => ['required', 'boolean'],
            'requires_approval' => ['required', 'boolean'],
            'ordering' => ['required', 'integer', 'min:0', 'max:100000'],
        ]);
        if ($data['admin_type'] === 'no-admin') {
            $data['admin_fee'] = 0;
        }
        if ($id !== null) {
            DB::table('payment_methods')->where('id', $id)->update($data + ['updated_at' => now()]);

            return response()->json(['id' => $id, 'message' => 'Payment method updated.']);
        }
        $id = DB::table('payment_methods')->insertGetId($data + ['type' => 'all', 'is_raw_description' => false, 'created_at' => now(), 'updated_at' => now()]);

        return response()->json(['id' => $id, 'message' => 'Payment method added.'], 201);
    }

    public function status(Request $request, int $id): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        abort_unless(DB::table('payment_methods')->where('id', $id)->exists(), 404);
        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        DB::table('payment_methods')->where('id', $id)->update($data + ['updated_at' => now()]);

        return response()->json(['message' => $data['is_active'] ? 'Payment method activated.' : 'Payment method deactivated.']);
    }
}
