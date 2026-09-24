<?php

namespace App\Support;

use Illuminate\Http\Request;

class ClientIp
{
    public static function get(Request $request): ?string
    {
        $ip = config('services.railway.ingress') ? $request->header('X-Real-IP') : $request->server('REMOTE_ADDR');

        return is_string($ip) && filter_var($ip, FILTER_VALIDATE_IP) ? inet_ntop(inet_pton($ip)) : null;
    }
}
