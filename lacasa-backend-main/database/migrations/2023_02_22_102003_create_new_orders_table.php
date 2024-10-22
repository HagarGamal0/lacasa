<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('cart_id');
            $table->string('status')->default('Processing');
            $table->longText('notes')->nullable();
            $table->integer('payment_method_id');
            $table->integer('address_book_id');
            $table->integer('user_id');
            $table->string('payment_status');
            $table->string('payment_status_description')->default('Waiting Payment');
            $table->integer('payment_id')->nullable();
            $table->integer('payment_order_id')->nullable();
            $table->float('commission')->default(0);
            $table->float('vendor_revenue')->default(0);
            $table->integer('coupon_id')->nullable();
            $table->float('down_payment')->default(0);
            $table->float('valu_down_payment')->default(0);
            $table->json('paymob_response')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('new_orders');
    }
};
