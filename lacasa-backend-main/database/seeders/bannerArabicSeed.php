<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class bannerArabicSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $inputXlsxFilePath = database_path('banners.xlsx');

        $spreadsheet = IOFactory::load($inputXlsxFilePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        foreach ($rows as $k=>$row) {
            if($row[1]!=""){
                $_data[$k] =  $row;
                DB::table('images')->updateOrInsert(
                    ['imageable_id' => $row[0],'locale' => 'ar','description'=>'Dynamic Image'],
                    [
                        'url' => $row[1], 
                        'locale' => 'ar',
                        'description' => 'Dynamic Image',
                        'imageable_id' => $row[0],
                        'imageable_type' => 'App\Models\StaticData\DynamicItem'
                    ]
                );
            }
        }
    }
}
