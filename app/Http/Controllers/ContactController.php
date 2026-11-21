<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Requête de contact reçue : ' . json_encode($request->all()));

            $validatedData = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'message' => 'required|string',
            ]);

            Log::info('Données validées : ' . json_encode($validatedData));

            $contact = Contact::create($validatedData);

            Log::info('Contact enregistré : ' . json_encode($contact));

            return response()->json(['message' => 'Message envoyé avec succès.', 'contact' => $contact], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors du traitement de la requête : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
    public function index()
{
    try {
        $contacts = Contact::all();
        return response()->json($contacts);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la récupération des messages de contact : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur interne du serveur.'], 500);
    }
}
public function markAsRead(Request $request, $id)
{
    try {
        $contact = Contact::findOrFail($id);
        $contact->is_read = true;
        $contact->save();
        Log::info('Message marqué comme lu : ' . $id);
        return response()->json(['message' => 'Message marqué comme lu.'], 200);
    } catch (\Exception $e) {
        Log::error('Erreur lors du marquage comme lu du message ' . $id . ': ' . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la mise à jour du statut.'], 500);
    }
}

public function destroy($id)
{
    try {
        $contact = Contact::findOrFail($id);
        $contact->delete();
        Log::info('Message supprimé : ' . $id);
        return response()->json(['message' => 'Message supprimé avec succès.'], 200);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la suppression du message ' . $id . ': ' . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la suppression du message.'], 500);
    }
}

}