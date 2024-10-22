<?php

use App\Models\Catalog\CategoryTranslation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use PhpOffice\PhpSpreadsheet\IOFactory;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
     

        $inputXlsxFilePath = database_path('category.xlsx');

        $spreadsheet = IOFactory::load($inputXlsxFilePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        foreach ($rows as $k=>$row) {
            if($row[2]!=""){
                $_data[$k] =  $row;
                DB::table('category_translations')->updateOrInsert(
                    ['category_id' => $row[2],'locale' => 'ar'],
                    [
                        'name' => $row[1], 
                        'locale' => 'ar',
                        'category_id' => $row[2],
                    ]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
