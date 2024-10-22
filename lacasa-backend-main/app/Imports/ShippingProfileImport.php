<?php

namespace App\Imports;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Shipping\ShippingProfile;
use App\Models\User\Vendor;
use App\Models\World\City;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ShippingProfileImport implements ToCollection
{
    /**
     * @param  Collection  $collection
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {
            if (! $key == 0) {
                $shippingProfile = ShippingProfile::create([
                    'name' => $row[0] . ' - ' . $row[1],
                ]);
                $rules = collect();
                $rules->push([
                    'city_id' => 1, // Cairo
                    'shipping_fee' => $row[2],
                    'estimated_delivery' => $row[4],
                    'is_disabled' => 0,
                ]);
                $rules->push([
                    'city_id' => 2, // Giza
                    'shipping_fee' => $row[3],
                    'estimated_delivery' => $row[4],
                    'is_disabled' => 0,
                ]);
                for ($x = 5; $x <= 32; $x++) {
                    // dd($rows[0][$x]);
                    $city_id = City::where('name', $rows[0][$x])->first()?->id;
                    // printf($city_id ?: $rows[0][$x]);
                    $rules->push([
                        'city_id' => $city_id ?: $rows[0][$x],
                        // 'city_id' => $rows[0][$x],
                        'shipping_fee' => $row[$x] == 'OOz' || $row[$x] == 'OOZ' ? 0 : $row[$x],
                        'estimated_delivery' => $row[33],
                        'is_disabled' => $row[$x] == 'OOz' || $row[$x] == 'OOZ' ? 1 : 0,
                    ]);
                }
                // $rules = [
                //  [
             //    'city_id' => 1, // Cairo
             //    'shipping_fee' => $row[2],
             //    'estimated_delivery' => $row[4],
             //    'is_disabled' => 0,
                //  ],
                //  [
             //    'city_id' => 2, // Cairo
             //    'shipping_fee' => $row[3],
             //    'estimated_delivery' => $row[4],
             //    'is_disabled' => 0,
                //  ],
                //  [
             //    'city_id' => 3, // Alexandria
             //    'shipping_fee' => $row[5] == 'OOZ' ? 0 : $row[5] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[5] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 4, // Dakahlia
             //    'shipping_fee' => $row[6] == 'OOZ' ? 0 : $row[6] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[6] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 5, // Red Sea
             //    'shipping_fee' => $row[7] == 'OOZ' ? 0 : $row[7] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[7] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 6, // Beheira
             //    'shipping_fee' => $row[8] == 'OOZ' ? 0 : $row[8] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[8] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 7, // Fayoum
             //    'shipping_fee' => $row[9] == 'OOZ' ? 0 : $row[9] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[9] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 8, // Gharbiya
             //    'shipping_fee' => $row[10] == 'OOZ' ? 0 : $row[10] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[10] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 9, // Ismailia
             //    'shipping_fee' => $row[11] == 'OOZ' ? 0 : $row[11] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[11] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 10, // Menofia
             //    'shipping_fee' => $row[12] == 'OOZ' ? 0 : $row[12] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[12] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 11, // Minya
             //    'shipping_fee' => $row[13] == 'OOZ' ? 0 : $row[13] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[13] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 12, // Qaliubiya
             //    'shipping_fee' => $row[14] == 'OOZ' ? 0 : $row[14] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[14] == 'OOZ' ? 1 : 0 ,
                //  ],
                //  [
             //    'city_id' => 13, // New Valley
             //    'shipping_fee' => $row[14] == 'OOZ' ? 0 : $row[14] ,
             //    'estimated_delivery' => $row[33],
             //    'is_disabled' => $row[14] == 'OOZ' ? 1 : 0 ,
                //  ],
                // ];
                $shippingRules = $shippingProfile->shipping_rules()->createMany($rules);
                // dd($row[1]);
                $vendor = Vendor::whereCompanyName($row[0])->first()?->user->id;
                printf($vendor ? '' : $row[0]);
                if ($row[1] == 'outdoor Chaise Lounges') {
                    $category = 109;
                } else {
                    $category = Category::where('name', $row[1])->first()?->id;
                }
                printf($category ? '' : $row[1]);
                $products = Product::whereVendorId($vendor)->whereHas('categories', function ($query) use ($category) {
                    $query->where('id', $category);
                })->update(['shipping_profile_id' => $shippingProfile->id]);
            }
        }
    }
}
