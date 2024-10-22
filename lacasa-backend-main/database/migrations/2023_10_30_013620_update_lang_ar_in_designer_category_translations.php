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
           // migrate users
         $lastId = 0;
         $hasMore = true;
         do {
             $categories = DB::table("designer_category_translations")->where([
                ['id', ">", $lastId],
                ['locale', "=", 'en']
            ])->limit(1000)->select("*")->get();
             $dataToInsert = [];
             foreach ($categories as $category) {
                 $dataToInsert[] = [
                     'designer_category_id' => $category->designer_category_id,
                     'locale'               => 'ar',
                     'name'                 => $category->name,
                     'description'         => $category->description,
                     'image'               => $category->image,
                 ];
             }
             DB::table("designer_category_translations")->insert($dataToInsert);
             $hasMore = count($categories) > 0;
             if ($hasMore) {
                 $lastId = $categories[count($categories) - 1]->id;
             }
         } while ($hasMore);
    }


};