<?php

namespace Database\Seeders;

use App\Models\Sales\Shipping\ShippingProvider;
use Illuminate\Database\Seeder;

class ShippingProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ShippingProvider::truncate();
        ShippingProvider::insert([
            [
                'name' => 'Shipped by vendor',
                'key' => 'vendor',
            ],
            [
                'name' => 'La Casa',
                'key' => 'lacasa',
            ],
            [
                'name' => 'Bosta',
                'key' => 'bosta',
            ],
            [
                'name' => 'El Zafer',
                'key' => 'elzafer',
            ],
        ]);
    }
}
