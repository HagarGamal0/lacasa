<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressBooksTable extends Migration
{
    public function up()
    {
        Schema::create('address_books', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->integer('area_id');
            $table->longText('address');
            $table->enum('type', ['shipping', 'billing'])->default('shipping');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('address_books');
    }
}
