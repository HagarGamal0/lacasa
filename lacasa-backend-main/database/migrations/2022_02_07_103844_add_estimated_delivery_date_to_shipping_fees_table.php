<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEstimatedDeliveryDateToShippingFeesTable extends Migration
{
    public function up()
    {
        Schema::table('shipping_fees', function (Blueprint $table) {
            $table->string('estimated_delivery')->nullable();
        });
    }

    public function down()
    {
        Schema::table('shipping_fees', function (Blueprint $table) {
            //
        });
    }
}
