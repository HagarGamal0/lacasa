<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shipping_profile_rules', function (Blueprint $table) {
            $table->id();
            $table->integer('shipping_profile_id');
            $table->integer('city_id');
            $table->integer('shipping_fee');
            $table->boolean('is_disabled')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shipping_profile_rules');
    }
};
