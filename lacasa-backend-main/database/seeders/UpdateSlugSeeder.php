<?php

namespace Database\Seeders;

use App\Models\Catalog\Product\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateSlugSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $duplicates = DB::table('products')
                        ->selectRaw('GROUP_CONCAT(`id`) `id_group`, `slug`')
                        ->groupBy('slug')
                        ->havingRaw('COUNT(*) > 1')
                        ->get();
        foreach ($duplicates as $duplicate) {
            $ids = explode(',', $duplicate->id_group);
            rsort($ids);
            foreach ($ids as $duplicate_id) {
                $product = Product::find($duplicate_id);
                $product->generateSlug();
                $product->save();
            }
        }
    }
}
