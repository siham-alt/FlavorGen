<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::where('user_id', auth()->id())->with('recipe')->get();
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $favorite = Favorite::create([
            'user_id' => Auth::id(),
            'recipe_id' => $request->recipe_id,
        ]);
        return response()->json($favorite, 201);
    }

    public function destroy($recipeId)
    {
        Favorite::where('user_id', Auth::id())->where('recipe_id', $recipeId)->delete();
        return response()->json(null, 204);
    }
}