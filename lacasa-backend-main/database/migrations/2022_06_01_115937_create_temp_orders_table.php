<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('temp_orders', function (Blueprint $table) {
            $table->id()->from(6000);
            $table->integer('user_id');
            $table->integer('address_book_id');
            $table->integer('payment_method_id');
            $table->integer('total');
            $table->integer('shipping_fees');
            $table->integer('subtotal');
            $table->string('status');
            $table->integer('payment_id')->nullable();
            $table->longText('notes')->nullable();
            $table->integer('commission')->default(0);
            $table->integer('coupon_id')->nullable();
            $table->integer('coupon_discount')->default(0);
            $table->integer('vendor_revenue')->default(0);
            $table->enum('payment_status', ['Paid', 'Unpaid', 'Declined', 'Cash On Delivery', 'Failed'])->default('Unpaid');
            $table->string('payment_order_id')->nullable();
            $table->string('payment_status_description')->default('Waiting Purchase');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('temp_orders');
    }
};
