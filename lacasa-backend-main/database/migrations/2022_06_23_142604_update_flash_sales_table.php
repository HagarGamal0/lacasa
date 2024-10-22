<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('flash_sales', function (Blueprint $table) {
            $table->dropColumn('product_id');
            $table->dropColumn('price_after_sale');
            $table->dropColumn('is_free_shipping');
            $table->string('campaign_name');
            $table->integer('precentage_discount');
            $table->boolean('has_shipping_profile');
        });
    }

    public function down()
    {
        //
    }
};
