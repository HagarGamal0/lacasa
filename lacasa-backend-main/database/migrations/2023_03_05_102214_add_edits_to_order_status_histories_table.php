<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('order_status_histories', function (Blueprint $table) {
            $table->integer('cart_item_id');
        });
    }

    public function down()
    {
        Schema::table('order_status_histories', function (Blueprint $table) {
            //
        });
    }
};