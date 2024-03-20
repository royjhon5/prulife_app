<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MasterFileController;
use App\Http\Controllers\NewRecruitController;
use App\Http\Controllers\RecruitPaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::any('/byb-list', [MasterFileController::class, 'byb_list']);
Route::any('/um-list', [MasterFileController::class, 'unit_manager_list']);
Route::any('/req-list', [MasterFileController::class, 'requirements_list']);
Route::any('/new-recruit', [NewRecruitController::class, 'new_recruit']);
Route::any('/exam-payment', [RecruitPaymentController::class, 'new_payment']);
Route::post('/login', [AuthController::class, 'login']);
// test route
Route::any('/test-method', [KioskController::class, 'test_method']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);   
    Route::post('/change-password', [AuthController::class, 'change_password']);
});
