<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء Admin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // إنشاء 5 مستخدمين عاديين + مهمتين لكل مستخدم
        User::factory(5)->create()->each(function ($user) {
            Task::factory(2)->create([
                'assigned_to' => $user->id,
                'created_by' => $user->id,
            ]);
        });
    }
}
