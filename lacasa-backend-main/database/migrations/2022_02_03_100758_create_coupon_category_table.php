<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponCategoryTable extends Migration
{
    public function up()
    {
        Schema::create('coupon_category', function (Blueprint $table) {
            $table->integer('coupon_id');
            $table->integer('category_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupon_category');
    }
}
