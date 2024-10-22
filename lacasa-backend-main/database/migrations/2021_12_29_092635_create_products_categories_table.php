<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('products_categories', function (Blueprint $table) {
            $table->integer('product_id');
            $table->integer('category_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products_categories');
    }
}
