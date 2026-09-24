<?php

namespace App\Http\Middleware;

use App\Support\ClientIp;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class BlockBannedIp
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = ClientIp::get($request);
        abort_if($ip && DB::table('ip_bans')->where('ip', $ip)->exists(), 403, 'Access from this IP address has been blocked. Contact support.');

        return $next($request);
    }
}
