
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\TestimonialController;

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\FacebookAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController; // Assurez-vous d'importer le contrôleur
use App\Http\Controllers\UserController; // Assurez-vous d'importer le contrôleur


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');




Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);



// Route pour l'authentification Facebook
Route::post('/auth/facebook', [FacebookAuthController::class, 'handleFacebookLogin']);

Route::post('/auth/google', [GoogleAuthController::class, 'handleGoogleLogin']);


Route::get('/search-recipes', [RecipeController::class, 'searchRecipes']);
Route::get('/recipes/{id}', [RecipeController::class, 'getRecipeDetails']);






Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/ingredients', [IngredientController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/testimonials', [TestimonialController::class, 'store']);

    Route::post('/preferences', [PreferenceController::class, 'store']);
    Route::get('/preferences', [PreferenceController::class, 'show']);
    Route::post('/recipes', [RecipeController::class, 'store']); // Assurez-vous que cette ligne est présente
    Route::get('/recipes', [RecipeController::class, 'index']);
    Route::get('/recipes/{id}', [RecipeController::class, 'show']); Route::post('/recipes', [RecipeController::class, 'store']);
    Route::get('/favoris', [FavoriteController::class, 'index']);
    Route::post('/favoris', [FavoriteController::class, 'store']);
    Route::delete('/favoris/{recipeId}', [FavoriteController::class, 'destroy']);
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::put('/updateProfile',  [AuthController::class, 'updateProfile']);
});


use App\Http\Controllers\MealPlanController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/meal-plans', [MealPlanController::class, 'index']);
    Route::post('/meal-plans', [MealPlanController::class, 'store']);
    Route::delete('/meal-plans/{mealPlan}', [MealPlanController::class, 'destroy']);
});




use App\Http\Controllers\ContactController;
Route::post('/contact', [ContactController::class, 'store']);













use App\Http\Controllers\HistoryController;
    Route::delete('/history/clear', [HistoryController::class, 'clear']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/history', [HistoryController::class, 'store']);
    Route::get('/history', [HistoryController::class, 'index']);
    Route::get('/history/{history}', [HistoryController::class, 'show']);
    Route::delete('/history/{history}', [HistoryController::class, 'destroy']); // Ajout de cette route

});

















Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']); // Liste des utilisateurs
    Route::get('/users/search', [UserController::class, 'search']); // Recherche utilisateur
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Supprimer/Bloquer utilisateur
    Route::get('/stats/users-active', [UserController::class, 'activeUsers']); // Stats utilisateurs actifs
    Route::get('/users/stats', [UserController::class, 'stats']);
    Route::get('/users/monthly-registrations', [UserController::class, 'monthlyRegistrations']);
    Route::get('/users/average-activity-time', [UserController::class, 'averageActivityTime']);
    Route::get('/users/recently-updated-profiles', [UserController::class, 'recentlyUpdatedProfiles']);
    Route::get('/contact/messages', [ContactController::class, 'index']);
    Route::get('/ingredients/stats', [RecipeController::class, 'getTopIngredients']);

});


// New routes for actions
Route::patch('/contact/messages/{id}/read', [ContactController::class, 'markAsRead']);
Route::patch('/contact/messages/{id}/resolved', [ContactController::class, 'markAsResolved']);
Route::delete('/contact/messages/{id}', [ContactController::class, 'destroy']);



use App\Http\Controllers\ClarifaiController;

Route::post('/clarifai/analyze', [ClarifaiController::class, 'analyze']);