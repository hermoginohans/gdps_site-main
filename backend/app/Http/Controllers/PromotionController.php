<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PromotionController extends Controller
{
    public function show(): JsonResponse
    {
        $row = DB::table('promotional_popups')->where('id', 1)->first();
        $promotion = $row ? json_decode($row->data, true) : null;

        return response()->json(['promotion' => ($promotion['enabled'] ?? false) ? $promotion : null])->header('Cache-Control', 'no-store');
    }

    public function edit(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $row = DB::table('promotional_popups')->where('id', 1)->first();

        return response()->json(['promotion' => $row ? json_decode($row->data, true) : null]);
    }

    public function update(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'title' => ['required', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
            'image_url' => ['nullable', 'url:https', 'max:2000'],
            'button_label' => ['nullable', 'required_with:button_url', 'string', 'max:50'],
            'button_url' => ['nullable', 'required_with:button_label', 'url:https', 'max:2000'],
        ]);
        $data['revision'] = (string) Str::uuid();
        DB::table('promotional_popups')->updateOrInsert(['id' => 1], ['data' => json_encode($data, JSON_THROW_ON_ERROR)]);

        return response()->json(['promotion' => $data, 'message' => 'Promotional popup saved.']);
    }
}
