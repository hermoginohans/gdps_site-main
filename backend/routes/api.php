<?php

use App\Http\Controllers\AdminPaymentMethodController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StreamerCodeController;
use App\Http\Middleware\EnsureAccountEnabled;
use Illuminate\Support\Facades\Route;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register/availability', [AuthController::class, 'availability'])->middleware('throttle:60,1');

Route::middleware(['auth:sanctum', EnsureAccountEnabled::class])->group(function (): void {
    Route::get('/admin/streamer-codes', [StreamerCodeController::class, 'index']);
    Route::post('/admin/streamer-codes', [StreamerCodeController::class, 'save']);
    Route::put('/admin/streamer-codes/{id}', [StreamerCodeController::class, 'save'])->whereNumber('id');
    Route::get('/account', [StoreController::class, 'account']);
    Route::get('/admin', [StoreController::class, 'admin']);
    Route::get('/admin/payment-methods', [AdminPaymentMethodController::class, 'index']);
    Route::post('/admin/payment-methods', [AdminPaymentMethodController::class, 'store']);
    Route::put('/admin/payment-methods/{id}', [AdminPaymentMethodController::class, 'store'])->whereNumber('id');
    Route::patch('/admin/payment-methods/{id}/status', [AdminPaymentMethodController::class, 'status'])->whereNumber('id');
    Route::get('/admin/coupons', [CouponController::class, 'index']);
    Route::post('/admin/coupons', [CouponController::class, 'save']);
    Route::put('/admin/coupons/{id}', [CouponController::class, 'save'])->whereNumber('id');
    Route::get('/admin/report', [StoreController::class, 'report']);
    Route::get('/admin/orders', [StoreController::class, 'orderList']);
    Route::get('/admin/orders/{id}', [StoreController::class, 'orderDetails'])->whereNumber('id');
    Route::post('/admin/products', [StoreController::class, 'save']);
    Route::put('/admin/products/{id}', [StoreController::class, 'save'])->whereNumber('id');
    Route::put('/admin/users/{id}', [StoreController::class, 'updateUser'])->whereNumber('id');
    Route::post('/admin/news', [StoreController::class, 'saveNews']);
    Route::put('/admin/news/{id}', [StoreController::class, 'saveNews'])->whereNumber('id');
    Route::delete('/admin/news/{id}', [StoreController::class, 'deleteNews'])->whereNumber('id');
    Route::put('/admin/support/{id}', [StoreController::class, 'updateSupport'])->whereNumber('id');
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::get('/products', [StoreController::class, 'products']);
Route::get('/payment-methods', [AdminPaymentMethodController::class, 'active']);
Route::post('/coupons/quote', [CouponController::class, 'quote'])->middleware('throttle:30,1');
Route::get('/products/{slug}', [StoreController::class, 'productDetails'])->where('slug', '[A-Za-z0-9_-]+')->middleware('throttle:60,1');
Route::post('/support', [StoreController::class, 'submitSupport'])->middleware('throttle:10,1');
Route::post('/streamer-codes/quote', [StreamerCodeController::class, 'quote'])->middleware('throttle:60,1');
Route::get('/news', [StoreController::class, 'news']);
Route::get('/news/{slug}', [StoreController::class, 'newsPost']);
