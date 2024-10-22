<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('flash_reprices', function (Blueprint $table) {
            $table->id();
            $table->integer('product_id');
            $table->decimal('flash_price');
            $table->datetime('start_date');
            $table->datetime('expire_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('flash_reprices');
    }
};
