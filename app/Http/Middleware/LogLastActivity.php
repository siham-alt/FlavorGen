<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class LogLastActivity {
    public function handle(Request $request, Closure $next) {
        if (Auth::check()) {
            Auth::user()->update(['last_activity' => Carbon::now()]);
        }
        return $next($request);
    }
}