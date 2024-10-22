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
        Schema::table('products_categories', function (Blueprint $table) {
            $table->unsignedInteger('index', true)->first();
        });
        Schema::table('taggables', function (Blueprint $table) {
            $table->id()->first();
        });
    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      
        Schema::table('products_categories', function (Blueprint $table) {
            $table->dropColumn('index');
        });

        Schema::table('taggables', function (Blueprint $table) {
            $table->dropColumn('id');
        });
    
   
    }
};
