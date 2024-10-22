<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('designer_designer_category', function (Blueprint $table) {
            $table->integer('designer_id');
            $table->integer('designer_category_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('designer_designer_category');
    }
};
