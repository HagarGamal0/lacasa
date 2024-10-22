<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('address_books', function (Blueprint $table) {
            $table->string('first_name');
            $table->string('last_name');
            $table->dropColumn('name');
        });
    }

    public function down()
    {
        Schema::table('address_books', function (Blueprint $table) {
            //
        });
    }
};
