<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Ajout de cette ligne
use Illuminate\Support\Facades\Storage; // Ajout de cette ligne


class AuthController extends Controller
{
    // Méthode pour l'inscription de l'utilisateur
    public function signup(Request $request)
    {
      
        $request->validate([
          'nom' => 'required|string|max:255',
    'email' => 'required|email|unique:users',
    'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
            'token' => $token
        ], 201);
    }
    
    // Méthode pour la connexion de l'utilisateur
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Identifiants incorrects'], 401);
        }
    
        $token = $user->createToken('YourAppnom')->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
        
    }
    
    // Méthode pour la déconnexion de l'utilisateur
    public function logout(Request $request)
{
    $request->user()->tokens()->delete();
    return response()->json(['message' => 'Déconnexion réussie']);
}
public function updateProfile(Request $request)
{
    Log::info('Données reçues pour la mise à jour du profil:', $request->all());

    try {
        $user = auth()->user();

        $data = $request->json()->all();

        $validator = Validator::make($data, [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . auth()->user()->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            Log::error('Erreurs de validation:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Données validées:', $request->all());

        $user->nom = $data['nom'];
        $user->email = $data['email'];

        if (isset($data['password']) && $data['password']) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        Log::info('Profil mis à jour avec succès:', $user->toArray());

        return response()->json(['message' => 'Profil mis à jour avec succès.'], 200);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la mise à jour du profil:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json(['message' => 'Erreur interne du serveur.'], 500);
    }
}
}