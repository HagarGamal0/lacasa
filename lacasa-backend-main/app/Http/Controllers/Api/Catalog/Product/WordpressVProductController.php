<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use App\Models\Catalog\Product\Attribute;
use App\Models\Catalog\Product\Product;
use App\Models\User\User;
use App\Models\User\Vendor;
use Illuminate\Support\Facades\Http;
use Storage;
use Str;

class WordpressVProductController extends Controller
{
    public function sync($page = 1)
    {
        $response = $this->getProducts($page);
        $collections = json_decode($response);
        $products = collect($collections)->map(function ($product) {
            $vendor = Vendor::whereCompanyName($product->vendor->name)->first();
            if ($vendor) {
                $vendor = $vendor->user->id;
            } else {
                $user = User::create([
                    'name' => $product->vendor->name,
                    'email' => Str::random(12) . '@lacasa-egy.com',
                    'phone' => '01000000000',
                    'password' => Str::random(24),
                ]);
                $vendor_data = $user->vendor()->create([
                    'company_name' => $product->vendor->name,
                    'email' => Str::random(12) . '@lacasa-egy.com',
                    'street_address' => 'NA',
                    'city_id' => '1',
                    'logo' => '/imgs/default-logo.png',
                ]);
                $vendor = $user->id;
            }

            return [
                'name' => $product->name,
                'sku' => $product->sku,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'price' => $product->regular_price ? $product->regular_price : $product->price,
                'discount' => $product->regular_price ? intval($product->regular_price) - intval($product->price) : 0,
                'discount_type' => 'fixed',
                'vendor_id' => $vendor,
                'status' => 'Published',
                'type' => 'variant',
                'featured' => $product->featured,
                'stock' => '1000',
                'images' => $product->images,
                'categories' => $product->categories,
                'attributes' => $product->attributes,
            ];
        })
          ->toArray();

        foreach ($products as $product) {
            if ($product['price']) {
                $create = Product::updateOrCreate(
                    collect($product)->except(['images', 'categories', 'price', 'discount', 'discount_type', 'attributes'])->toArray(),
                    collect($product)->only(['price', 'discount', 'discount_type'])->toArray());
                if ($create->wasRecentlyCreated) {
                    //insert Images to recently created product;
                    if (isset($product['images'])) {
                        foreach ($product['images'] as $image) {
                            $name = substr($image->src, strrpos($image->src, '/') + 1);
                            $name = 'lacasa-' . Str::random(8) . '-' . $name;
                            if (! Storage::exists('public/products/' . $create->id . '/' . $name)) {
                                $image = Storage::put('public/products/' . $create->id . '/' . $name, file_get_contents($image->src), 'public');
                            }
                            $image_url = Storage::url('public/products/' . $create->id . '/' . $name);
                            $create->images()->create([
                                'url' => $image_url,
                                'description' => 'Product Image',
                            ]);
                        }
                    }

                    if (isset($product['categories'])) {
                        foreach ($product['categories'] as $category) {
                            $cat = Category::updateOrCreate(['name' => $category->name], ['slug' => $category->slug]);
                            $create->categories()->syncWithoutDetaching($cat->id);
                        }
                    }
                    if (isset($product['attributes'])) {
                        foreach ($product['attributes'] as $attribute) {
                            $created_attribute = Attribute::updateOrCreate(['name' => $attribute->name]);

                            if ($attribute->name == 'Fabric Color') {
                                $val = $created_attribute->values()->updateOrCreate(['value' => '0']);
                                $create->attribute_values()->attach($val);
                            } else {
                                $values = $attribute->options;
                                foreach ($values as $value) {
                                    $val = $created_attribute->values()->updateOrCreate(['value' => $value]);
                                    $create->attribute_values()->attach($val);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (count($collections) == 100) {
            $this->sync($page + 1);
            exit();
        }

        return Product::all();
    }

    public function getProducts($page)
    {
        $response = Http::get('https://lacasa-egy.com/wp-json/wc/v3/products?consumer_key=ck_6f91f8071cd5f63bbf35f6f7ab7b91005da793aa&consumer_secret=cs_38cc4b3c4fc410233c33443bb7d38375a99bd79e&per_page=100&page=' . $page . '&type=variable&status=publish');

        return $response;
    }

    public function add_after_sale_price()
    {
        // return Product::first()->update(['price_after_sale' => Product::first()->price_after_sale]);
        foreach (Product::all() as $product) {
            // return $product->price_after_sale;
            $product->update(['price_after_sale' => $product->price_after_sale]);
        }

        return Product::all();
    }

    public function deleteVars()
    {
        foreach (Product::where('type', 'variant')->get() as $product) {
            foreach ($product->images()->get() as $image) {
                $image_url = str_replace(Storage::url('public'), 'public', $image->url);
                Storage::delete($image->url);
                $image->delete();
            }
            $product->delete();
        }
    }
}
