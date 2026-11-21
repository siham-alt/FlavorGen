<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function search(Request $request) {
        $query = User::query();
    
        if ($request->has('q')) {
            $search = $request->q;
            $query->where('nom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
        }
    
        return response()->json(['users' => $query->get()]);
    }
    

    public function destroy($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function activeUsers() {
        $users = User::all();
    
        $usersWithStatus = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
                'last_activity' => $user->last_activity,
                'statut' => $user->isActive() ? "Actif" : "Inactif", // Ajoute bien "statut"
            ];
        });
        return response()->json(['users' => $usersWithStatus]);
    }
    public function stats() {
        $activeCount = User::where('last_activity', '>=', now()->subMinutes(5))->count();
        $inactiveCount = User::where('last_activity', '<', now()->subMinutes(5))->count();
    
        return response()->json([
            'active' => $activeCount,
            'inactive' => $inactiveCount
        ]);
    }
    public function monthlyRegistrations()
{
    $registrations = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    // Convertir les numéros de mois en noms
    $months = [
        1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
        5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
        9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre'
    ];

    // Ajouter les noms des mois aux résultats
    $formattedRegistrations = $registrations->map(function ($reg) use ($months) {
        return [
            'month' => $months[$reg->month] ?? $reg->month,
            'count' => $reg->count
        ];
    });

    return response()->json($formattedRegistrations);
}
//Temps moyen d'activité des utilisateurs 
public function averageActivityTime()
{
    $users = User::all();
    $totalMinutes = 0;
    $userCount = 0;

    foreach ($users as $user) {
        if ($user->last_activity) {
            $totalMinutes += Carbon::parse($user->last_activity)->diffInMinutes(now());
            $userCount++;
        }
    }

    $averageTime = $userCount > 0 ? $totalMinutes / $userCount : 0;
    return response()->json(['average_time' => $averageTime]);
}
//Utilisateurs ayant mis à jour leur profil récemment
public function recentlyUpdatedProfiles() {
    $updatedProfiles = User::where('updated_at', '>=', now()->subDays(30))
        ->count();
    return response()->json(['updated_profiles' => $updatedProfiles]);
}
    
}