<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTypeToAttributesTable extends Migration
{
    public function up()
    {
        Schema::table('attributes', function (Blueprint $table) {
            $table->string('type')->default('select');
        });
    }

    public function down()
    {
        Schema::table('attributes', function (Blueprint $table) {
            //
        });
    }
}
