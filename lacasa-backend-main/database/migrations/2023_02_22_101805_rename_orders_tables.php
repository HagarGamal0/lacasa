<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::rename('orders', 'old_orders');
        Schema::rename('orders_products', 'old_orders_products');
        Schema::rename('temp_orders', 'old_temp_orders');
        Schema::rename('temp_orders_products', 'old_temp_orders_products');
    }

    public function down()
    {
        //
    }
};
