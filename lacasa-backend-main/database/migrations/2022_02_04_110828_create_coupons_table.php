<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponsTable extends Migration
{
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('coupon_code')->unique();
            $table->enum('usage_type', ['single', 'multiple']);
            $table->integer('no_of_usage')->nullable();
            $table->enum('discount_type', ['fixed', 'precentage']);
            $table->integer('discount_value');
            $table->boolean('has_categories')->default(0);
            $table->integer('used_count')->default(0);
            $table->integer('total_discounts')->default(0);
            $table->timestamp('expiry');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupons');
    }
}
