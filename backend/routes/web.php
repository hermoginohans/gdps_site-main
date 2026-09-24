<?php

use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Illuminate\View\Middleware\ShareErrorsFromSession;

Route::get('/', function () {
    if (is_file(public_path('index.html'))) {
        return response()->file(public_path('index.html'), ['Cache-Control' => 'no-cache']);
    }

    return response()->json([
        'service' => 'GPDS Game Shop API',
        'status' => 'online',
    ]);
})->withoutMiddleware([StartSession::class, ShareErrorsFromSession::class, PreventRequestForgery::class]);

Route::get('/reset-password/{token}', function (Request $request, string $token) {
    $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

    return redirect()->away($frontend.'/reset-password?token='.urlencode($token).'&email='.urlencode((string) $request->query('email')));
})->name('password.reset');

Route::middleware('throttle:google-oauth')->group(function (): void {
    Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
    Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);
});

Route::get('/{path}', function () {
    abort_unless(is_file(public_path('index.html')), 404);

    return response()->file(public_path('index.html'), ['Cache-Control' => 'no-cache']);
})->where('path', '(?!(?:api|sanctum|auth|up|assets)(?:/|$))[^.]*')
    ->withoutMiddleware([StartSession::class, ShareErrorsFromSession::class, PreventRequestForgery::class]);
