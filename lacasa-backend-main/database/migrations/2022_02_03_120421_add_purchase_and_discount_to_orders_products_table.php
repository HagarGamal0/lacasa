<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPurchaseAndDiscountToOrdersProductsTable extends Migration
{
    public function up()
    {
        Schema::table('orders_products', function (Blueprint $table) {
            $table->integer('purchase_price')->default(0);
            $table->integer('coupon_discount')->default(0);
        });
    }

    public function down()
    {
        Schema::table('orders_products', function (Blueprint $table) {
            //
        });
    }
}
