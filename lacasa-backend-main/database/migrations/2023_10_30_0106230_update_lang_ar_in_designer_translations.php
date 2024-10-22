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
            $desginers = DB::table("designer_translations")->where([
                ['id', ">", $lastId],
                ['locale', "=", 'en']
            ])->limit(1000)->select("*")->get();
            $dataToInsert = [];
            foreach ($desginers as $desginer) {
                $dataToInsert[] = [
                    'designer_id' => $desginer->designer_id,
                    'locale'               => 'ar',
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
    }


};
