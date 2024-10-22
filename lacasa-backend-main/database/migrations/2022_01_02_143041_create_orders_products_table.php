<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersProductsTable extends Migration
{
    public function up()
    {
        Schema::create('orders_products', function (Blueprint $table) {
            $table->integer('product_id');
            $table->integer('order_id');
            $table->integer('price');
            $table->integer('quantity');
            $table->integer('shipping_fees');
            $table->integer('subtotal');
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders_products');
    }
}
