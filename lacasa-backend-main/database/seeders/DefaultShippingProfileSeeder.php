<?php

namespace Database\Seeders;

use App\Models\Sales\Shipping\ShippingProfile;
use App\Models\World\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

// use App\Models\Sales\Shipping\ShippingProfileRule;

class DefaultShippingProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('shipping_profiles')->truncate();
        DB::table('shipping_profile_rules')->truncate();

        $profile = ShippingProfile::create(['name' => 'Default Profile']);
        foreach (City::all() as $city) {
            $profile->shipping_rules()->create([
                'shipping_profile_id' => $profile->id,
                'city_id' => $city->id,
                'shipping_fee' => 150,
                'is_disabled' => 0,
                'estimated_delivery' => '2 ~ 3 days delivery',
            ]);
        }
    }
}
