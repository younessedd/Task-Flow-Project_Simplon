<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // المهام التي أنشأها المستخدم
    public function tasksCreated()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    // المهام الموكلة لهذا المستخدم
    public function tasksAssigned()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }
}
