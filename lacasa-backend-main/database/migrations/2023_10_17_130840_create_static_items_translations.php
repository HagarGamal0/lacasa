<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('static_item_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dynamic_item_id');
            $table->string('locale')->index();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('description')->nullable();
            $table->foreign('dynamic_item_id')->references('id')->on('static_items')->onDelete('cascade');
            $table->timestamps();
        });


         // migrate users
         $lastId = 0;
         $hasqMore = true;
         do {
             $items = DB::table("static_items")->where('id', ">", $lastId)->limit(1000)->select("*")->get();
             $dataToInsert = [];
             foreach ($items as $item) {
                 $dataToInsert[] = [
                     'dynamic_item_id' => $item->id,
                     'locale'         => 'en',
                     'title'          => $item->title,
                     'subtitle'       => $item->subtitle,
                     'description'    => $item->description,
                 ];
             }
             DB::table("static_item_translations")->insert($dataToInsert);
             $hasMore = count($items) > 0;
             if ($hasMore) {
                 $lastId = $items[count($items) - 1]->id;
             }
         } while ($hasMore);
 
         Schema::table('static_items', function (Blueprint $table) {
             $table->dropColumn('title');
             $table->dropColumn('subtitle');
             $table->dropColumn('description');
         });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('static_item_translations');
    }
};
