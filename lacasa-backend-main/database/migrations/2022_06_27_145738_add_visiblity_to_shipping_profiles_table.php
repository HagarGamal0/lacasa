<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('shipping_profiles', function (Blueprint $table) {
            $table->boolean('visible')->default(1);
        });
    }

    public function down()
    {
        Schema::table('shipping_profiles', function (Blueprint $table) {
            //
        });
    }
};
