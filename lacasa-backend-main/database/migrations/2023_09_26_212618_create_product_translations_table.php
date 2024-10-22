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
        Schema::create('product_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('locale')->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->timestamps();
        });

        // migrate users
        $lastId = 0;
        $hasqMore = true;
        do {
            $products = DB::table("products")->where('id', ">", $lastId)->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($products as $product) {
                $dataToInsert[] = [
                    'product_id' => $product->id,
                    'locale' => 'en',
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

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('description');
            $table->dropColumn('short_description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_translations');
    }
};
