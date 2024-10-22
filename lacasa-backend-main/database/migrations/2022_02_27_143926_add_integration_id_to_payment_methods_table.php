<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->integer('integration_id')->nullable();
        });
    }

    public function down()
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            //
        });
    }
};