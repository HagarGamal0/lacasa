<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description');
            $table->integer('price');
            $table->integer('discount');
            $table->enum('discount_type', ['precentage', 'fixed']);
            $table->integer('category_id');
            $table->integer('vendor_id');
            $table->enum('status', ['Pending', 'Published', 'Draft', 'Trash'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
