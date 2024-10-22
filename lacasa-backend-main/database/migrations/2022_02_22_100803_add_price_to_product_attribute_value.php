<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('product_attribute_value', function (Blueprint $table) {
            $table->integer('price')->nullable();
            $table->integer('price_after_sale')->nullable();
        });
    }

    public function down()
    {
        Schema::table('product_attribute_value', function (Blueprint $table) {
            //
        });
    }
};
