<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class ClarifaiController extends Controller
{
  public function analyze(Request $request)
  {
    // Validation de l'image envoyée
    $request->validate([
      'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,jfif|max:2048',
    ]);

    // Récupérer l'image téléchargée
    $image = $request->file('image');

    // Convertir l'image en Base64
    $imageBase64 = base64_encode(file_get_contents($image->getRealPath()));

    // Récupérer la clé API et l'ID du modèle depuis l'environnement
    $apiKey = env('CLARIFAI_API_KEY');
    $modelId = env('CLARIFAI_MODEL_ID', 'food-item-recognition'); // Modèle par défaut
    $clarifaiApiUrl = env('CLARIFAI_API_URL', 'https://api.clarifai.com'); // URL par défaut si non défini

    // Vérifier si la clé API est configurée
    if (!$apiKey) {
      return response()->json(['error' => 'Clarifai API key not configured in the environment.'], 500);
    }

    // Envoi de la requête à Clarifai
    try {
      $response = Http::withHeaders([
        'Authorization' => "Key " . $apiKey,
        'Content-Type' => 'application/json'
      ])->post("$clarifaiApiUrl/v2/models/$modelId/outputs", [
        'inputs' => [[
          'data' => ['image' => ['base64' => $imageBase64]]
        ]]
      ]);

      // Vérification de la réponse
      if ($response->successful()) {
        return response()->json($response->json());
      } else {
        return response()->json(['error' => 'Clarifai API error', 'details' => $response->json()], $response->status());
      }
    } catch (\Exception $e) {
      return response()->json(['error' => 'An error occurred while communicating with the Clarifai API.', 'message' => $e->getMessage()], 500);
    }
  }
}
