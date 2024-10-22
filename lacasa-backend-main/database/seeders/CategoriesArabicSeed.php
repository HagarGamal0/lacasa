<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class CategoriesArabicSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
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
}
