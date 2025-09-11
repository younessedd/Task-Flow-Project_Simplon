<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\UserController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/user',[AuthController::class,'me']);

    Route::apiResource('tasks',TaskController::class);
    Route::post('tasks/{task}/status',[TaskController::class,'changeStatus']);

    Route::get('/users',[UserController::class,'index']);
});
