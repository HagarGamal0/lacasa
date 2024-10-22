<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->integer('quantity')->default(1);
            $table->float('total')->default(0);
        });
    }

    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            //
        });
    }
};
