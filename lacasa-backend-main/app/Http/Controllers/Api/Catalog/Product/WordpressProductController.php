<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\Order;
use App\Models\Sales\Order\OrderProduct;
use App\Models\Sales\Shipping\ShippingProfile;
use App\Models\User\AddressBook;
use App\Models\User\User;
use App\Models\User\Vendor;
use DB;
use Illuminate\Support\Facades\Http;
use Storage;
use Str;

class WordpressProductController extends Controller
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
                'discount' => intval($product->regular_price) - intval($product->price),
                'discount_type' => 'fixed',
                'vendor_id' => $vendor,
                'status' => 'Published',
                'featured' => $product->featured,
                'stock' => '1000',
                'images' => $product->images,
                'categories' => $product->categories,
            ];
        })
          ->toArray();

        // return $products;
        foreach ($products as $product) {
            $create = Product::updateOrCreate(
                collect($product)->except(['images', 'categories', 'price', 'discount', 'discount_type'])->toArray(),
                collect($product)->only(['price', 'discount', 'discount_type'])->toArray());
            if ($create->wasRecentlyCreated) {
                //insert Images to recently created product;
                if (isset($product['images'])) {
                    foreach ($product['images'] as $image) {
                        $name = substr($image->src, strrpos($image->src, '/') + 1);
                        $name = 'lacasa-' . Str::random(16) . '-' . $name;
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
        $response = Http::get('https://lacasa-egy.com/wp-json/wc/v3/products?consumer_key=ck_6f91f8071cd5f63bbf35f6f7ab7b91005da793aa&consumer_secret=cs_38cc4b3c4fc410233c33443bb7d38375a99bd79e&per_page=100&page=' . $page . '&type=simple&status=publish');

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

    public function removeDuplicates()
    {
        $duplicates = DB::table('products')
        ->select('name', 'sku', DB::raw('COUNT(*) as `count`'))
        ->groupBy('name', 'sku')
        ->havingRaw('COUNT(*) > 1')
        ->get();
        // foreach($duplicates as $duplicate)
        // {
        //   $products = Product::whereName($duplicate->name)->whereSku($duplicate->sku)->get();
        //   foreach($products as $key => $product)
        //   if(!$key == 0)
        //   {
      //     $product->delete();
        //   }
        // }
        return $duplicates;
    }

    public function touch()
    {
        foreach (Product::all() as $product) {
            $product->update(['price_after_sale' => $product->price_after_sale]);
        }
    }

    public function test()
    {
        $product = [
            'name' => 'name',
            'sku' => 'sku',
            'description' => 'description',
            'short_description' => 'short_description',
            'price' => 10,
            'discount' => 20,
            'discount_type' => 'fixed',
            'vendor_id' => 1,
            'status' => 'Published',
            'featured' => 1,
            'stock' => '1000',
            'images' => [
                'url' => 'asdasda',
                'description' => 'asdasda',
            ],
        ];

        $created = Product::createMany($product);

        return $created;
    }

    public function addNameToAddress()
    {
        foreach (AddressBook::all() as $address) {
            $full_name = $address->user->name;
            $parts = explode(' ', $full_name);
            $lastname = array_pop($parts);
            $firstname = implode(' ', $parts);
            $address->update(['first_name' => $firstname ?: $address->user->name, 'last_name' => $lastname ?: $address->user->name]);
        }
    }

    public function initSizeAttribute()
    {
        foreach (Product::all() as $product) {
            $items = $product->attribute_values()->whereHas('attribute', function ($q) {
                $q->where('name', 'Size');
            })->get();
            foreach ($items as $item) {
                $product->attribute_values()->updateExistingPivot($item->id, [
                    'price' => $product['price'],
                    'price_after_sale' => $product['price_after_sale'],
                ]);
            }
        }
    }

    public function cleanOrderedProducts()
    {
        foreach (OrderProduct::all() as $product) {
            $order_id = $product->order_id;
            if (! Order::find($order_id)) {
                $product->whereProductId($product->product_id)->whereOrderId($product->order_id)->delete();
                // return '$product->delete();';
                // OrderProduct::destroy($product->id);
            }
        }
    }

    public function cleanShippingFee()
    {
        foreach (ShippingFee::all() as $fees) {
            if (Category::find($fees->category_id)->has('childs', '>', 0)) {
                ShippingFee::whereCategoryId($fees->category_id)->delete();
            }
        }
    }

    public function updatePrices()
    {
        // ProductAttributeValue::all()
        // return Product::find(5074);7)->orWhere('id', 58
        foreach (Product::all() as $product) {
            if ($product->discount_type == 'fixed') {
                $product->update([
                    'price' => $product->price * 1.20,
                    'discount' => $product->discount * 1.20,
                    'price_after_sale' => $product->price_after_sale * 1.20,
                ]);
            }
            // $product->update([
            //   'price' =>  $product->price*1.20,
            //   'price_after_sale' => $product->price_after_sale*1.20,
            // ]);
            // $categories = $product->categories()->pluck('id');
            // if (!in_array("7", collect($categories)->toArray()) || !in_array("58", collect($categories)->toArray())) {
            // }
        }
    }

    public function updateCategories()
    {
        foreach (Product::all() as $product) {
            // $product = Product::first();
            $prodCats = $product->categories->pluck('id');
            $categories = collect($prodCats);
            foreach (Category::whereIn('id', $prodCats)->get() as $category) {
                $parent = $category->parent()->first();
                if ($parent) {
                    $parent = $parent->id;
                    $categories->push($parent);
                }
            }

            $categories = $categories->unique()->values();
            $categories = $categories->forget($categories->search(69))->values();
            $product->categories()->sync($categories);
        }
    }

    public function updateOrdersStatusesNew()
    {
        foreach (Order::all() as $order) {
            $order_statuses = OrderProduct::whereOrderId($order->id)->get()->pluck('status');
            $order_statuses = $order_statuses->filter(function ($value, $key) {
                return $value == 'Delivered' && $value == 'Cancelled';
            })->values();
            // return $order_statuses;
            if ($order_statuses->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Complete']);
                if ($order::find($order->id)->payment_method->name == 'cod') {
                    Order::find($order->id)->update(['payment_status' => 'Paid', 'payment_status_description' => 'Paid Upon Delivery']);
                }
            }
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Confirmed')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Confirmed']);
            }
            // Update Order Status if All Products are Confirmed
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Pending payment')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Pending payment']);
            }
            // Update Order Status if All Products are Shipped
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Shipped')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Shipped']);
            }
            // Update Order Status if All Products are Cancelled
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Cancelled')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Cancelled']);
            }
            // Update Order Status if All Products are Returned
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Returned')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Returned']);
            }
            // Update Order Status if All Products are Rejected
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Rejected')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Rejected']);
            }
            // Update Order Status if All Products are Refunded
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Refunded')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Refunded']);
            }
            // Update Order Status if All Products are Delivered failed
            if (OrderProduct::whereOrderId($order->id)->where('status', 'Delivered failed')->count() == Order::find($order->id)->products()->count()) {
                Order::find($order->id)->update(['status' => 'Delivered failed']);
            }
            if ($order::find($order->id)->status != 'Complete' && $order::find($order->id)->payment_method->name == 'cod') {
                Order::find($order->id)->update(['payment_status' => 'Cash On Delivery', 'payment_status_description' => 'Waiting Purchase']);
            }
        }
    }

    public function updateAddresses()
    {
        foreach (AddressBook::all() as $address) {
            $address->update([
                'address' => $address->building_no . ' ' . $address->street . ' Apartment No.:' . $address->apartment_no . ' Floor No.' . $address->floor_no,
            ]);
        }
    }

    public function updateShippingProfiles()
    {
        foreach (ShippingProfile::all() as $profile) {
            $product = $profile->products()->first();
            if ($product) {
                $profile->update(['vendor_id' => $product->vendor_id]);
            }
        }
    }
}
