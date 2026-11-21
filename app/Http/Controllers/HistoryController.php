<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function store(Request $request)
    {
        $recipes = $request->recipes ? json_encode($request->recipes) : null; // Convertir les recettes en JSON si elles existent

        $history = History::create([
            'user_id' => auth()->id(),
            'action' => $request->action,
            'details' => $request->details,
            'type' => $request->type,
        ]);

        return response()->json($history, 201);
    }

    public function index()
    {
        $histories = History::where('user_id', auth()->id())->get();
        return response()->json($histories);
    }

    public function show(History $history)
    {
        return response()->json($history);
    }

    public function destroy(History $history)
    {
        $history->delete();
        return response()->json(null, 204);
    }
    public function clear()
    {
        History::where('user_id', auth()->id())->delete();
        return response()->json(null, 204);
    }
}