<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // جلب المستخدمين العاديين فقط
        $users = User::where('is_admin',0)->get();
        return response()->json($users);
    }
}
