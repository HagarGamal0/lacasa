<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('designers', function (Blueprint $table) {
            $table->integer('experience')->nullable();
            $table->string('price_range')->nullable();
            $table->integer('area_id')->nullable();
            $table->string('address')->nullable();
        });
    }

    public function down()
    {
        Schema::table('designers', function (Blueprint $table) {
            //
        });
    }
};
