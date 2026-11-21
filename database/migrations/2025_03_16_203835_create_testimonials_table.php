<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestimonialsTable extends Migration
{
    public function up()
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('quote');
            $table->integer('stars');
            $table->date('date');
            $table->unsignedBigInteger('user_id'); // Nouvelle colonne pour l'ID de l'utilisateur
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Clé étrangère
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('testimonials');
    }
}