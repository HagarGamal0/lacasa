<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Owner Name, Owner Phone, Seller Company address, LaCasa Account Manager Name, LaCasa Account Manager Phone, LaCasa Account Manager Email
        Schema::table('vendors', function (Blueprint $table) {
            $table->string('owner_name')->nullable();
            $table->string('owner_phone')->nullable();
            // $table->string('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vendors', function (Blueprint $table) {
            //
        });
    }
};
