<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('temp_orders', function (Blueprint $table) {
            $table->integer('shipping_discount')->default(0);
            $table->integer('flash_sale_discount')->default(0);
        });
    }

    public function down()
    {
        Schema::table('temp_orders', function (Blueprint $table) {
            //
        });
    }
};
