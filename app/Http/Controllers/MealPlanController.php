<?php

namespace App\Http\Controllers;

use App\Models\MealPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MealPlanController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date');

        $mealPlans = MealPlan::where('user_id', auth()->id())
            ->where('date', $date)
            ->with('recipe')
            ->get();

        return response()->json($mealPlans);
    }

    public function store(Request $request)
    {
        Log::info('Requête de création de plan de repas reçue : ' . json_encode($request->all()));

        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'recipe_id' => 'required|integer|exists:recipes,id',
        ]);

        if ($validator->fails()) {
            Log::error('Erreurs de validation du plan de repas : ' . json_encode($validator->errors()));
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $mealPlan = MealPlan::create([
                'user_id' => auth()->id(),
                'date' => $request->date,
                'recipe_id' => $request->recipe_id,
                'meal_type' => $request->meal_type,
            ]);

            Log::info('Plan de repas créé avec succès : ' . json_encode($mealPlan));
            return response()->json($mealPlan, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du plan de repas : ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['errors' => ['server' => 'Erreur interne du serveur.']], 500);
        }
    }

    public function destroy(MealPlan $mealPlan)
    {
        $mealPlan->delete();
        return response()->json(null, 204);
    }
}