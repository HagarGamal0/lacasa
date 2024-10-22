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
        Schema::create('designer_category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('designer_category_id');
            $table->string('locale')->index();
            $table->string('name');
            $table->string('description')->nullable();
            $table->text('image')->nullable();
            $table->foreign('designer_category_id')->references('id')->on('designer_categories')->onDelete('cascade');
            $table->timestamps();
        });

        // migrate users
        $lastId = 0;
        $hasqMore = true;
        do {
            $categories = DB::table("designer_categories")->where('id', ">", $lastId)->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($categories as $category) {
                $dataToInsert[] = [
                    'designer_category_id' => $category->id,
                    'locale'               => 'en',
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

        Schema::table('designer_categories', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('description');
            $table->dropColumn('image');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('designer_category_translations');
    }
};
