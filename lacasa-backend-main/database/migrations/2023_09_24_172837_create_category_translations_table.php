<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::create('category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->string('locale')->index();
            $table->string('name');
            $table->string('discreptions')->nullable();
            $table->text('banner')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // migrate users
        $lastId = 0;
        $hasqMore = true;
        do {
            $categories = DB::table("categories")->where('id', ">", $lastId)->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($categories as $category) {
                $dataToInsert[] = [
                    'category_id' => $category->id,
                    'locale' => 'en',
                    'name'   => $category->name,
                    'banner' => $category->banner,
                ];
            }
            DB::table("category_translations")->insert($dataToInsert);
            $hasMore = count($categories) > 0;
            if ($hasMore) {
                $lastId = $categories[count($categories) - 1]->id;
            }
        } while ($hasMore);

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('banner');
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
        Schema::dropIfExists('category_translations');
    }
};
