<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orange_vouchers', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->string('voucher');
            $table->double('value');
            $table->boolean('is_redeemed')->default(0);
            $table->string('mobile');
            $table->string('transaction_id');
            $table->string('pin')->nullable();
            $table->string('remaining_points')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orange_vouchers');
    }
};
