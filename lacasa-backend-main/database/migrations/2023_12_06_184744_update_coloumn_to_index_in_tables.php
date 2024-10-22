<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('images', function(Blueprint $table)
        {
            $table->index('imageable_id');
        });

        Schema::table('carts', function(Blueprint $table)
        {
            $table->index('ip');
        });

       DB::statement('DELETE FROM `products_categories` WHERE `product_id` NOT IN (SELECT `id` FROM `products`)');
        Schema::table('products_categories', function (Blueprint $table) {
            $table->bigInteger('product_id')->index()->change();
            $table->bigInteger('category_id')->index()->change();
//            $table->foreign('product_id')->references('id')->on('products');
//            $table->foreign('category_id')->references('id')->on('categories');
        });

        Schema::table('vendors', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->index()->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

        });



    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('index_in_tables', function (Blueprint $table) {
            //
        });
    }
};
