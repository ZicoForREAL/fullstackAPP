<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Coach\CoachController;
use App\Http\Controllers\Client\ClientController;

Route::get('/test', [TestController::class, 'test']);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/admin/check', [AuthController::class, 'checkAdmin']);
    
    // Coach routes
    Route::get('/coach/check', [CoachController::class, 'checkCoach']);
    Route::get('/coach/sessions', [CoachController::class, 'getSessions']);
    Route::post('/coach/sessions', [CoachController::class, 'createSession']);
    Route::delete('/coach/sessions/{id}', [CoachController::class, 'deleteSession']);
    
    // Client routes
    Route::get('/client/check', [ClientController::class, 'checkClient']);
    Route::get('/client/available-sessions', [ClientController::class, 'getAvailableSessions']);
    Route::get('/client/booked-sessions', [ClientController::class, 'getBookedSessions']);
    Route::post('/client/book-session/{sessionId}', [ClientController::class, 'bookSession']);
    Route::delete('/client/cancel-booking/{bookingId}', [ClientController::class, 'cancelBooking']);
});
