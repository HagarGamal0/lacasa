<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('address_books', function (Blueprint $table) {
            $table->string('street_name');
            $table->string('apartment_no');
            $table->string('building_no');
            $table->string('floor_no');
        });
    }

    public function down()
    {
        Schema::table('address_books', function (Blueprint $table) {
            //
        });
    }
};
