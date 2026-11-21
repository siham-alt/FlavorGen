<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::with('user:id,nom')->get();
        return response()->json($testimonials);
    }

    public function store(Request $request)
    {
        Log::info('Requête pour ajouter un témoignage reçue : ' . json_encode($request->all()));

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'quote' => 'required|string',
            'stars' => 'required|integer|min:1|max:5',
            'date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            Log::error('Erreur de validation : ' . json_encode($validator->errors()));
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $testimonial = Testimonial::create($request->all());
            Log::info('Témoignage ajouté avec succès : ' . json_encode($testimonial));
            return response()->json($testimonial, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout du témoignage : ' . $e->getMessage());
            Log::error('Trace de l\'erreur : ' . $e->getTraceAsString());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
}