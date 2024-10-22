<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('traffic', function (Blueprint $table) {
            $table->id();
            $table->string('trafficable_type');
            $table->integer('trafficable_id');
            $table->string('ip');
            $table->integer('visits');
            $table->datetime('date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('traffic');
    }
};
