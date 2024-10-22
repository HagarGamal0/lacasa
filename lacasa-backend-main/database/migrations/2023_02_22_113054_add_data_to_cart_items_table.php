<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->float('commission')->default(0);
            $table->float('vendor_revenue')->default(0);
            $table->string('status')->default('Processing');
        });
    }

    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            //
        });
    }
};
