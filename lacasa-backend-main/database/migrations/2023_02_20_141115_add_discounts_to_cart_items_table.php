<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->json('discounts');
        });
    }

    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            //
        });
    }
};
