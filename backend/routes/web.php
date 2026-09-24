<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function (Request $request, string $token) {
    $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

    return redirect()->away($frontend.'/reset-password?token='.urlencode($token).'&email='.urlencode((string) $request->query('email')));
})->name('password.reset');

Route::middleware('throttle:google-oauth')->group(function (): void {
    Route::get('/auth/google/redirect', [\App\Http\Controllers\AuthController::class, 'googleRedirect']);
    Route::get('/auth/google/callback', [\App\Http\Controllers\AuthController::class, 'googleCallback']);
});
