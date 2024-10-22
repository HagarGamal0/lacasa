<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->integer('usage_limit_per_user')->default(1000);
            $table->integer('usage_limit')->default(1000);
            $table->integer('min_purchase')->default(0);
            $table->integer('min_quantity')->default(0);
            $table->datetime('start_date')->default(Carbon::now());
            $table->enum('allocation_method', ['each', 'across']);
        });
    }

    public function down()
    {
        Schema::table('coupons', function (Blueprint $table) {
            //
        });
    }
};
