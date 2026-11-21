<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'message',
        'is_read', // Add this
        'is_resolved', // Add this
    ];

    // Or, if you prefer to guard specific fields:
    // protected $guarded = ['id'];
}