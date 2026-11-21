<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $fillable = [
        'nom',
        'email',
        'password',
        'role',
        'profile_image',
        'last_activity',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
   
    protected $appends = ['statut'];

    public function isActive() {
        if ($this->last_activity) {
            $diff = Carbon::parse($this->last_activity)->diffInMinutes(now());
            Log::info("User ID: {$this->id}, Last Activity: {$this->last_activity}, Diff: {$diff} min");
    
            return $diff < 5; // Actif si la dernière activité est < 5 minutes
        }
        return false;
    }
    public function getStatutAttribute()
{
    return $this->isActive() ? 'Actif' : 'Inactif';
}

    
}