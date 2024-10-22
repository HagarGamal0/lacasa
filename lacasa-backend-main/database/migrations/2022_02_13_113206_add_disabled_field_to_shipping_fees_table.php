<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDisabledFieldToShippingFeesTable extends Migration
{
    public function up()
    {
        Schema::table('shipping_fees', function (Blueprint $table) {
            $table->boolean('is_disabled')->default(0);
        });
    }

    public function down()
    {
        Schema::table('shipping_fees', function (Blueprint $table) {
            //
        });
    }
}
