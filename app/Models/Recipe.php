<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'image',
        'image_type', // Ajout de image_type
        'ready_in_minutes',
        'servings',
        'instructions',
        'ingredients',
        'difficulty',
        'cuisine_type',
        'diet',
        'calories',
        'carbohydrates',
        'fat',
        'sugar',
        'protein',
    ];

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}