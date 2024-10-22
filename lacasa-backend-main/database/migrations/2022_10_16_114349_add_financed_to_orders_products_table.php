<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders_products', function (Blueprint $table) {
            $table->boolean('financed')->default(0);
        });
    }

    public function down()
    {
        Schema::table('orders_products', function (Blueprint $table) {
            //
        });
    }
};