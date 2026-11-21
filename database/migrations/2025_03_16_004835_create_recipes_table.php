<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image')->nullable();
            $table->enum('image_type', ['url', 'base64'])->nullable(); // Supprimer after 'image'
            $table->integer('ready_in_minutes')->nullable();
            $table->integer('servings')->nullable();
            $table->text('instructions')->nullable();
            $table->text('ingredients')->nullable();
            $table->string('difficulty')->nullable();
            $table->string('cuisine_type')->nullable();
            $table->string('diet')->nullable();
            // Ajout des colonnes pour les valeurs nutritionnelles
            $table->float('calories')->nullable();
            $table->float('carbohydrates')->nullable();
            $table->float('fat')->nullable();
            $table->float('sugar')->nullable();
            $table->float('protein')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};