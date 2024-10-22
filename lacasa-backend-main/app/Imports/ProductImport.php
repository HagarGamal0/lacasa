<?php

namespace App\Imports;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product\Product;
use App\Models\Catalog\Tag;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Row;

class ProductImport implements OnEachRow, WithStartRow, WithValidation
{
    public function startRow(): int
    {
        return 2;
    }

    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $row = $row->toArray();
        // Perepare Pricing & Discounts.
        $discounts = [
            'price' => $row[7],
            'price_after_sale' => $row[8],
            'discount' => $row[7] - $row[8],
            'discount_type' => 'fixed',
        ];
        $data = [
            'name' => [
                'ar' => $row[0],
                'en' => $row[1],
            ],
            'description' => [
                'ar' => nl2br($row[2]),
                'en' => nl2br($row[3]),
            ],
            'short_description' => [
                'ar' => nl2br($row[4]),
                'en' => nl2br($row[5]),
            ],
        ];

        // Prepare Product
        $product = Product::create([
            'price' => $discounts['price'],
            'name' => $row[1],
            'price_after_sale' => $discounts['price_after_sale'],
            'discount' => $discounts['discount'],
            'discount_type' => $discounts['discount_type'],
            'status' => $row[9],
            'vendor_id' => $row[10],
            'stock' => $row[11],
            'sku' => $row[12],
            'brand' => $row[13],
            'shipping_profile_id' => $row[14],
            'featured' => (int)$row[15],
        ]);
        foreach ($data['name'] as $lang => $name) {
            $product->translateOrNew($lang)->name = $name;
        }

        foreach ($data['description'] as $lang => $description) {
            $product->translateOrNew($lang)->description = $description;
        }
        foreach ($data['short_description'] as $lang => $short_description) {
            $product->translateOrNew($lang)->short_description = $short_description;
        }

        // Prepare Categories.
        $categories = Category::find($row[6])->getParentCategories();
        $product->categories()->syncWithoutDetaching($categories);

        // Prepare Tags.
        $tags = [$row[16], $row[17], $row[18]];
        $tag_ids = collect();
        foreach ($tags as $tag) {
            if ($tag) {
                $tag_id = Tag::firstorCreate(['name' => $tag]);
                $tag_ids->push($tag_id);
                $product->tags()->save($tag_id);
            }
        }

        // Append Images.
        $images_urls = [$row[19], $row[20], $row[21]];
        foreach ($images_urls as $url) {
            if ($url) {
                $product->images()->create(['url' => $url, 'description' => 'Product Image']);
            }
        }
        $product->save();

    }

    public function file_get_content_curl($url)
    {
        // Throw Error if the curl function does'nt exist.
        if (!\function_exists('curl_init')) {
            exit('CURL is not installed!');
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
    }

    public function rules(): array
    {
        return [
            '0' => 'string|required', // 'name'
            '1' => 'string|required', // 'name'
            '2' => 'string|required', //description
            '3' => 'string|required', //description
            '4' => 'string|required', //short_description
            '5' => 'string|required', //short_description
            '6' => 'integer|exists:categories,id', //sub_category_id
            '7' => 'required|regex:/^\d+(\.\d{1,2})?$/', // price
            '8' => 'required|regex:/^\d+(\.\d{1,2})?$/', //price_after_sale
            '9' => 'required|in:Draft,Published', //status
            '10' => 'required|exists:users,id', //vendor_id
            '11' => 'required|integer', //stock
            '12' => 'required|string', // sku
            '13' => 'nullable', //brand
            '14' => 'exists:shipping_profiles,id', //shipping_profile_id
            '15' => 'required|boolean', //featured
            '16' => 'nullable', //tag1
            '17' => 'nullable', //tag2
            '18' => 'nullable', //tag3
        ];
    }

    /**
     * @return array
     */
    public function customValidationAttributes(): array
    {
        return [
            '0' => 'name ar',
            '1' => 'name en',
            '2' => 'description ar',
            '3' => 'description en',
            '4' => 'short_description ar',
            '5' => 'short_description en',
            '6' => 'sub_category_id',
            '7' => 'price',
            '8' => 'price_after_sale',
            '9' => 'status',
            '10' => 'vendor_id',
            '11' => 'stock',
            '12' => 'sku',
            '13' => 'brand',
            '14' => 'shipping_profile_id',
            '15' => 'featured',
            '16' => 'tag1',
            '17' => 'tag2',
            '18' => 'tag3',
            '19' => 'image1',
            '20' => 'image2',
            '21' => 'image3',
        ];
    }
}
