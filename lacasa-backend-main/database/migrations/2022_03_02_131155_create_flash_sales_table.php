<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();
            $table->integer('product_id');
            $table->integer('price_after_sale');
            $table->boolean('is_free_shipping')->default(0);
            $table->datetime('expire_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('flash_sales');
    }
};
