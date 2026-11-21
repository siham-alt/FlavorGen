<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
{
    $response = $next($request);

    $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173'); // URL spécifique
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    $response->headers->set('Access-Control-Allow-Credentials', 'true');
    // Ajout des en-têtes pour Google Auth et éviter le blocage de `window.postMessage`
    $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    $response->headers->set('Cross-Origin-Embedder-Policy', 'credentialless');
    return $response;
}

    }


