<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StaticSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('static_sections')->truncate();
        $data = [
            ['id' => '1', 'name' => 'home-slider'],
            ['id' => '2', 'name' => 'home-slider-banner'],

        ];
        DB::table('static_sections')->insert($data);
    }
}
