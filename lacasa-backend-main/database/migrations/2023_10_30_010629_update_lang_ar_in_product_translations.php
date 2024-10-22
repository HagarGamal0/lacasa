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
        
            $products = DB::table("product_translations")->where([
                ['id', ">", $lastId],
                ['locale', "=", 'en']
            ])->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($products as $product) {
                $dataToInsert[] = [
                    'product_id'        => $product->product_id,
                    'locale'            => 'ar',
                    'name'              => $product->name,
                    'description'       => $product->description,
                    'short_description' => $product->short_description,
                ];
            }
            DB::table("product_translations")->insert($dataToInsert);
            $hasMore = count($products) > 0;
            if ($hasMore) {
                $lastId = $products[count($products) - 1]->id;
            }
        } while ($hasMore);
    }


};
