<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    /**
     * Récupère tous les ingrédients.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $ingredients = Ingredient::all();
        return response()->json($ingredients);
    }
    public function store(Request $request)
{
    $ingredient = Ingredient::create($request->all());
    return response()->json($ingredient, 201);
}
}