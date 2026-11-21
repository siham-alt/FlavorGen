<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Importez la classe Storage

class RecipeController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'ingredients' => 'required|string',
                'instructions' => 'required|string',
                'image' => 'nullable|string',
                'ready_in_minutes' => 'nullable|integer',
                'servings' => 'nullable|integer',
                'difficulty' => 'nullable|string',
                'cuisine_type' => 'nullable|string',
                'diet' => 'nullable|string',
                'calories' => 'nullable|numeric',
                'carbohydrates' => 'nullable|numeric',
                'fat' => 'nullable|numeric',
                'sugar' => 'nullable|numeric',
                'protein' => 'nullable|numeric',
            ]);

            // Traitement de l'image si elle est présente
            if ($request->has('image') && $request->image) {
                // Vérifier si l'image est une URL
                if (filter_var($request->image, FILTER_VALIDATE_URL)) {
                    $validatedData['image'] = $request->image; // Enregistrer l'URL Spoonacular
                } else {
                    // Si ce n'est pas une URL, on assume que c'est une chaîne base64
                    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
                    $imageName = uniqid() . '.jpg'; // Générez un nom unique pour l'image
                    Storage::disk('public')->put('recipes/' . $imageName, $imageData); // Stockez l'image dans le dossier storage/app/public/recipes
                    $validatedData['image'] = 'recipes/' . $imageName; // Enregistrez le chemin de l'image dans la base de données
                }
            }

            $recipe = Recipe::create($validatedData);

            return response()->json(['message' => 'Recette enregistrée avec succès', 'id' => $recipe->id], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement de la recette : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'enregistrement de la recette'], 500);
        }
    }

    public function show($id)
    {
        Log::info('Récupération des détails de la recette avec ID : ' . $id);
        $recipe = Recipe::find($id);
        if (!$recipe) {
            Log::error('Recette non trouvée avec ID : ' . $id);
            return response()->json(['message' => 'Recette non trouvée'], 404);
        }
        return response()->json($recipe);
    }

    public function getTopIngredients()
    {
        // Récupérer toutes les recettes
        $recipes = Recipe::all();
    
        // Tableau pour stocker tous les ingrédients
        $allIngredients = [];
    
        // Parcourir toutes les recettes et extraire les ingrédients
        foreach ($recipes as $recipe) {
            $ingredients = explode(', ', $recipe->ingredients); // Séparer par ", "
            foreach ($ingredients as $ingredient) {
                $ingredient = trim($ingredient); // Retirer les espaces superflus
                if (!empty($ingredient)) {
                    $allIngredients[] = $ingredient;
                }
            }
        }
    
        // Compter les occurrences des ingrédients
        $ingredientCount = array_count_values($allIngredients);
    
        // Trier par nombre d'occurrences, par ordre décroissant
        arsort($ingredientCount);
    
        // Limiter à 10 ingrédients les plus utilisés
        $topIngredients = array_slice($ingredientCount, 0, 10);
    
        return response()->json($topIngredients);
    }
}