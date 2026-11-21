<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class FacebookAuthController extends Controller
{
    public function handleFacebookLogin(Request $request)
    {
        try {
            $token = $request->input('token');  // Récupérer le token de Facebook depuis la requête

            // Vérifier le token via l'API de Facebook
            $facebookResponse = Http::get('https://graph.facebook.com/v12.0/me', [
                'access_token' => $token,
                'fields' => 'id,name,email,picture', // On demande les infos nécessaires
            ]);

            if ($facebookResponse->failed()) {
                return response()->json(['error' => 'Token Facebook invalide'], 401);
            }

            $facebookUser = $facebookResponse->json();

            // Vérifier si l'utilisateur existe déjà
            $user = User::where('email', $facebookUser['email'])->first();

            if (!$user) {
                // Créer un nouvel utilisateur si il n'existe pas
                $user = User::create([
                    'nom' => $facebookUser['name'] ?? 'Nom par défaut',
                    'email' => $facebookUser['email'],
                    'password' => bcrypt(uniqid()), // Générer un mot de passe aléatoire
                    'facebook_id' => $facebookUser['id'],
                    'avatar' => $facebookUser['picture']['data']['url'] ?? null, // Si l'avatar est disponible
                ]);
            }

            // Connecter l'utilisateur
            Auth::login($user);

            // Créer un token d'authentification Laravel pour l'utilisateur
            $token = $user->createToken('FacebookAuth')->plainTextToken;

            return response()->json([
                'message' => 'Authentification réussie via Facebook',
                'token' => $token,
                'user' => $user
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur interne : ' . $e->getMessage()], 500);
        }
    }
}
