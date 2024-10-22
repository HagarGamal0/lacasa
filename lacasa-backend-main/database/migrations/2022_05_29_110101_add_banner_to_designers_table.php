<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('designers', function (Blueprint $table) {
            $table->string('cover_photo')->nullable();
        });
    }

    public function down()
    {
        Schema::table('designers', function (Blueprint $table) {
            //
        });
    }
};
