<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'details',
        'type',
        'ingredients',
        'recipes',
        'duration',
    ];

    protected $casts = [
        'recipes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}