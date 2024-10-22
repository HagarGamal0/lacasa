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
        Schema::create('designer_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('designer_id');
            $table->string('locale')->index();
            $table->string('company_name');
            $table->string('job_title')->nullable();
            $table->string('bio')->nullable();
            $table->string('address')->nullable();
            $table->foreign('designer_id')->references('id')->on('designers')->onDelete('cascade');
            $table->timestamps();
        });

        // migrate users
        $lastId = 0;
        $hasqMore = true;
        do {
            $desginers = DB::table("designers")->where('id', ">", $lastId)->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($desginers as $desginer) {
                $dataToInsert[] = [
                    'designer_id' => $desginer->id,
                    'locale'               => 'en',
                    'company_name'         => $desginer->company_name,
                    'job_title'            => $desginer->job_title,
                    'bio'                  => $desginer->bio,
                    'address'              => $desginer->address,
                ];
            }
            DB::table("designer_translations")->insert($dataToInsert);
            $hasMore = count($desginers) > 0;
            if ($hasMore) {
                $lastId = $desginers[count($desginers) - 1]->id;
            }
        } while ($hasMore);

        Schema::table('designers', function (Blueprint $table) {
            $table->dropColumn('company_name');
            $table->dropColumn('job_title');
            $table->dropColumn('bio');
            $table->dropColumn('address');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('designer_translations');
    }
};
