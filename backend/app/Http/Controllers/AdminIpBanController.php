<?php

namespace App\Http\Controllers;

use App\Support\ClientIp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminIpBanController extends Controller
{
    public function save(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $data = $request->validate(['ip' => ['required', 'ip'], 'banned' => ['required', 'boolean']]);
        $ip = inet_ntop(inet_pton($data['ip']));
        if ($data['banned']) {
            abort_if($ip === ClientIp::get($request), 422, 'You cannot ban your current IP address.');
            DB::table('ip_bans')->insertOrIgnore(['ip' => $ip, 'created_by' => $request->user()->id, 'created_at' => now(), 'updated_at' => now()]);
        } else {
            DB::table('ip_bans')->where('ip', $ip)->delete();
        }

        return response()->json(['message' => $data['banned'] ? 'IP banned.' : 'IP unbanned.']);
    }
}
