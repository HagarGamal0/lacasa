<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDefaultToAddressBooksTable extends Migration
{
    public function up()
    {
        Schema::table('address_books', function (Blueprint $table) {
            $table->boolean('default')->default(0);
        });
    }

    public function down()
    {
        Schema::table('address_books', function (Blueprint $table) {
            //
        });
    }
}
