<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use \Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

            DB::statement('ALTER TABLE `images` DROP INDEX `images_imageable_id_index`');
            Schema::table('images', function(Blueprint $table)
            {
                $table->index(['imageable_id', 'imageable_type']);
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('index_in_image', function (Blueprint $table) {
            //
        });
    }
};
