<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShippingFeesTable extends Migration
{
    public function up()
    {
        Schema::create('shipping_fees', function (Blueprint $table) {
            $table->id();
            $table->integer('vendor_id');
            $table->integer('city_id');
            $table->integer('category_id');
            $table->integer('shipping_fees');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shipping_fees');
    }
}
