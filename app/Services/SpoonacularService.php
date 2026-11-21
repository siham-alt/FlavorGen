<?php

namespace App\Services;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class SpoonacularService extends Controller
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('SPOONACULAR_API_KEY');
        $this->baseUrl = env('SPOONACULAR_BASE_URL');
    }

    public function searchRecipes($ingredients)
    {
        $response = Http::get("{$this->baseUrl}/recipes/findByIngredients", [
            'ingredients' => implode(',', $ingredients),
            'number' => 5, // Nombre de recettes à récupérer
            'apiKey' => $this->apiKey
        ]);

        return $response->json();
    }

    public function getRecipeDetails($recipeId)
    {
        $response = Http::get("{$this->baseUrl}/recipes/{$recipeId}/information", [
            'apiKey' => $this->apiKey
        ]);

        return $response->json();
    }
}
