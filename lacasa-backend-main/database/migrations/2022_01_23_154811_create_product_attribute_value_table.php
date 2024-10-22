<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductAttributeValueTable extends Migration
{
    public function up()
    {
        Schema::create('product_attribute_value', function (Blueprint $table) {
            $table->id();
            $table->integer('product_id');
            $table->integer('attribute_value_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_attribute_value');
    }
}
