<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('temp_orders_products', function (Blueprint $table) {
            $table->integer('product_id');
            $table->integer('temp_order_id');
            $table->integer('price');
            $table->integer('quantity');
            $table->integer('shipping_fees');
            $table->integer('subtotal');
            $table->string('status')->default('Processing');
            $table->integer('commission')->default(0);
            $table->json('attributes')->nullable();
            $table->integer('vendor_revenue')->default(0);
            $table->integer('purchase_price')->default(0);
            $table->integer('coupon_discount')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('temp_orders_products');
    }
};
