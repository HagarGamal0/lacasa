<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefaultShippingFeesTable extends Migration
{
    public function up()
    {
        Schema::create('default_shipping_fees', function (Blueprint $table) {
            $table->id();
            $table->integer('city_id');
            $table->integer('category_id');
            $table->integer('shipping_fees')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('default_shipping_fees');
    }
}
