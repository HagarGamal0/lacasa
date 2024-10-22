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
         $lastId = 0;
         $hasMore = true;
         do {
             $items = DB::table("static_item_translations")->where([
                ['id', ">", $lastId],
                ['locale', "=", 'en']
            ])->limit(1000)->select("*")->get();
             $dataToInsert = [];
             foreach ($items as $item) {
                 $dataToInsert[] = [
                     'dynamic_item_id' => $item->dynamic_item_id,
                     'locale'         => 'ar',
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
    }


};
