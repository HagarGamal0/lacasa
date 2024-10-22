<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('count_banners', function (Blueprint $table) {
            $table->string('color')->nullable();
        });
    }

    public function down()
    {
        Schema::table('count_banners', function (Blueprint $table) {
            //
        });
    }
};
