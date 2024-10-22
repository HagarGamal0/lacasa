<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cities')->truncate();
        $data = [
            ['id' => '1', 'ar_name' => 'القاهرة', 'name' => 'Cairo'],
            ['id' => '2', 'ar_name' => 'الجيزة', 'name' => 'Giza'],
            ['id' => '3', 'ar_name' => 'الأسكندرية', 'name' => 'Alexandria'],
            ['id' => '4', 'ar_name' => 'الدقهلية', 'name' => 'Dakahlia'],
            ['id' => '5', 'ar_name' => 'البحر الأحمر', 'name' => 'Red Sea'],
            ['id' => '6', 'ar_name' => 'البحيرة', 'name' => 'Beheira'],
            ['id' => '7', 'ar_name' => 'الفيوم', 'name' => 'Fayoum'],
            ['id' => '8', 'ar_name' => 'الغربية', 'name' => 'Gharbiya'],
            ['id' => '9', 'ar_name' => 'الإسماعلية', 'name' => 'Ismailia'],
            ['id' => '10', 'ar_name' => 'المنوفية', 'name' => 'Menofia'],
            ['id' => '11', 'ar_name' => 'المنيا', 'name' => 'Minya'],
            ['id' => '12', 'ar_name' => 'القليوبية', 'name' => 'Qaliubiya'],
            ['id' => '13', 'ar_name' => 'الوادي الجديد', 'name' => 'New Valley'],
            ['id' => '14', 'ar_name' => 'السويس', 'name' => 'Suez'],
            ['id' => '15', 'ar_name' => 'اسوان', 'name' => 'Aswan'],
            ['id' => '16', 'ar_name' => 'اسيوط', 'name' => 'Assiut'],
            ['id' => '17', 'ar_name' => 'بني سويف', 'name' => 'Beni Suef'],
            ['id' => '18', 'ar_name' => 'بورسعيد', 'name' => 'Port Said'],
            ['id' => '19', 'ar_name' => 'دمياط', 'name' => 'Damietta'],
            ['id' => '20', 'ar_name' => 'الشرقية', 'name' => 'Sharkia'],
            ['id' => '21', 'ar_name' => 'جنوب سيناء', 'name' => 'South Sinai'],
            ['id' => '22', 'ar_name' => 'كفر الشيخ', 'name' => 'Kafr Al sheikh'],
            ['id' => '23', 'ar_name' => 'مطروح', 'name' => 'Matrouh'],
            ['id' => '24', 'ar_name' => 'الأقصر', 'name' => 'Luxor'],
            ['id' => '25', 'ar_name' => 'قنا', 'name' => 'Qena'],
            ['id' => '26', 'ar_name' => 'شمال سيناء', 'name' => 'North Sinai'],
            ['id' => '27', 'ar_name' => 'سوهاج', 'name' => 'Sohag'],
        ];
        DB::table('cities')->insert($data);
    }
}
