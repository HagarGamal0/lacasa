<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('payment_methods')->truncate();
        $data = [
            [
                'id' => 1,
                'name' => 'cod',
                'display_name' => 'Cash On Delivery',
            ],
            [
                'id' => 2,
                'name' => 'paymob',
                'display_name' => 'Credit Card',
            ],
        ];
        DB::table('payment_methods')->insert($data);
    }
}
