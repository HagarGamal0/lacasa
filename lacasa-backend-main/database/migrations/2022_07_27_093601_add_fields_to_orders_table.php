<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('valu_down_payment')->nullable();
        });
        Schema::table('temp_orders', function (Blueprint $table) {
            $table->string('valu_down_payment')->nullable();
        });
        Schema::table('orders_products', function (Blueprint $table) {
            $table->longText('shipping_notes')->nullable();
        });
        Schema::table('temp_orders_products', function (Blueprint $table) {
            $table->longText('shipping_notes')->nullable();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
