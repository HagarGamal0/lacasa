<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('wheel_offers', function (Blueprint $table) {
            $table->integer('coupon_id')->nullable();
        });
    }

    public function down()
    {
        Schema::table('wheel_offers', function (Blueprint $table) {
            //
        });
    }
};
