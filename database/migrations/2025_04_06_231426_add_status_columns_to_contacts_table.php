<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusColumnsToContactsTable extends Migration
{
    public function up()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('message'); // Add after the 'message' column
            $table->boolean('is_resolved')->default(false)->after('is_read'); // Add after the 'is_read' column
        });
    }

    public function down()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('is_read');
            $table->dropColumn('is_resolved');
        });
    }
}