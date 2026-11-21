<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class GoogleAuthController extends Controller
{
    public function handleGoogleLogin(Request $request)
    {
        try {
            $token = $request->input('token');

            // Vérifier le token via Google API
            $googleResponse = Http::get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
                'id_token' => $token,
            ]);

            if ($googleResponse->failed()) {
                return response()->json(['error' => 'Token Google invalide'], 401);
            }

            $googleUser = $googleResponse->json();

            // Vérifications supplémentaires
            if (!isset($googleUser['email']) || !isset($googleUser['sub'])) {
                return response()->json(['error' => 'Réponse Google invalide'], 400);
            }

            if ($googleUser['email_verified'] !== 'true') {
                return response()->json(['error' => 'Email non vérifié par Google'], 403);
            }

            if ($googleUser['iss'] !== 'https://accounts.google.com') {
                return response()->json(['error' => 'Émetteur du token invalide'], 403);
            }

            // Vérifier si l'utilisateur existe déjà
            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                // Créer un nouvel utilisateur
                $user = User::create([
                    'nom' => $googleUser['name'] ?? 'Nom par défaut',
                    'email' => $googleUser['email'],
                    'password' => bcrypt(uniqid()), // Génère un mot de passe aléatoire
                    'google_id' => $googleUser['sub'],
                    'avatar' => $googleUser['picture'] ?? null, // Stocke l'avatar
                ]);
            }

            // Connecter l'utilisateur
            Auth::login($user);

            // Retourner un token pour React
            $token = $user->createToken('GoogleAuth')->plainTextToken;

            return response()->json([
                'message' => 'Authentification réussie',
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur interne : ' . $e->getMessage()], 500);
        }
    }
}
