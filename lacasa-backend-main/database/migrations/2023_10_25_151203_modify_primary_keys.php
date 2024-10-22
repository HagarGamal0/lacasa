<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coupon_category', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('coupon_product', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('coupon_vendor', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('designer_designer_category', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('old_orders_products', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('old_temp_orders_products', function (Blueprint $table) {
            $table->id()->first();
        });
        Schema::table('password_resets', function (Blueprint $table) {
            $table->id()->first();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coupon_category', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('coupon_product', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('coupon_vendor', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('designer_designer_category', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('old_orders_products', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('old_temp_orders_products', function (Blueprint $table) {
            $table->dropColumn('id');
        });
        Schema::table('password_resets', function (Blueprint $table) {
            $table->dropColumn('id');
        });
    }
};
