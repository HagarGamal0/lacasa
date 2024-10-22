<?php

namespace App\Http\Controllers\Api\Sales\Offer;

use App\Http\Controllers\Controller;
use App\Http\Requests\FlashSale\Create;
use App\Http\Resources\FlashSale\FlashSaleResource;
use App\Http\Resources\Shipping\ShippingProfileProductResource as ProductResource;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Offer\FlashSale;
use App\Models\Sales\Shipping\ShippingProfile;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class FlashSaleController extends Controller
{
    public function index()
    {
        return FlashSaleResource::collection(FlashSale::all());
    }

    public function show($id)
    {
        return new FlashSaleResource(FlashSale::find($id));
    }

    public function store(Create $request)
    {
        $flash_sale = collect($request->validated())->except(['rules', 'products'])->toArray();
        if ($request->validated()['has_shipping_profile']) {
            $profile = ShippingProfile::create(['name' => $request->validated()['campaign_name'], 'visible' => 0]);
            try {
                $rules = $profile->shipping_rules()->createMany($request->validated()['rules']);
                $flash_sale = collect($flash_sale)->put('shipping_profile_id', $profile->id)->toArray();
            } catch(Exception $e) {
                $profile->delete();
                // return response(['message' => $e->getMessage()], 500);
                return response(['message' => 'Something wrong happened, Please try again later..'], 500);
            }
        }
        $flash_sale = FlashSale::create($flash_sale);

        $products = $request->validated()['products'];
        $products['vendors'] = ! empty($products['vendors']) ? $products['vendors'] : [];
        $products['categories'] = ! empty($products['categories']) ? $products['categories'] : [];
        $products['include'] = ! empty($products['include']) ? $products['include'] : [];
        $products['exclude'] = ! empty($products['exclude']) ? $products['exclude'] : [];
        $products['vendor_categories'] = ! empty($products['vendor_categories']) ? $products['vendor_categories'] : [];
        $bulk = Product::whereIn('vendor_id', $products['vendors'])
        ->orWhereIn('id', $products['include'])
        ->get()->merge(Product::WhereHas('categories', function ($query) use ($products) {
            $query->whereIn('id', $products['categories']);
        })->get());
        foreach ($products['vendor_categories'] as $vendor_categories) {
            $bulk = $bulk->merge(Product::whereVendorId($vendor_categories['id'])->WhereHas('categories', function ($query) use ($vendor_categories) {
                $query->whereIn('id', $vendor_categories['categories']);
            })->get());
        }
        $products = $bulk->whereNotIn('id', $products['exclude'])->values()->pluck('id');
        Product::whereIn('id', $products)->update(['flash_sale_id' => $flash_sale->id]);

        return new FlashSaleResource($flash_sale->fresh());
    }

    public function update(Create $request, $id)
    {
        $existing_flash_sale = FlashSale::find($id);
        //update flash sale shipping profile if exists;
        $flash_sale = collect($request->validated())->except(['rules', 'products'])->toArray();
        if ($request->validated()['has_shipping_profile']) {
            $profile = $existing_flash_sale->shipping_profile()->update(['name' => $request->validated()['campaign_name'], 'visible' => 0]);
            $profile = $existing_flash_sale->shipping_profile()->first();
            try {
                $rules = $profile->shipping_rules()->delete();
                $rules = $profile->shipping_rules()->createMany($request->validated()['rules']);
                $flash_sale = collect($flash_sale)->put('shipping_profile_id', $profile->id)->toArray();
            } catch(Exception $e) {
                $profile->delete();
                // return response(['message' => $e->getMessage()], 500);
                return response(['message' => 'Something wrong happened, Please try again later..'], 500);
            }
        }
        //update flash sale;
        $existing_flash_sale->update(collect($request->validated())->except(['rules', 'products'])->toArray());
        //add new products to flash sale;
        $products = $request->validated()['products'];
        $products['vendors'] = ! empty($products['vendors']) ? $products['vendors'] : [];
        $products['categories'] = ! empty($products['categories']) ? $products['categories'] : [];
        $products['include'] = ! empty($products['include']) ? $products['include'] : [];
        $products['exclude'] = ! empty($products['exclude']) ? $products['exclude'] : [];
        $products['vendor_categories'] = ! empty($products['vendor_categories']) ? $products['vendor_categories'] : [];
        $bulk = Product::whereIn('vendor_id', $products['vendors'])
        ->orWhereIn('id', $products['include'])
        ->get()->merge(Product::WhereHas('categories', function ($query) use ($products) {
            $query->whereIn('id', $products['categories']);
        })->get());
        foreach ($products['vendor_categories'] as $vendor_categories) {
            $bulk = $bulk->merge(Product::whereVendorId($vendor_categories['id'])->WhereHas('categories', function ($query) use ($vendor_categories) {
                $query->whereIn('id', $vendor_categories['categories']);
            })->get());
        }
        $products = $bulk->whereNotIn('id', $products['exclude'])->values()->pluck('id');
        Product::whereIn('id', $products)->update(['flash_sale_id' => $existing_flash_sale->id]);

        return new FlashSaleResource($existing_flash_sale->fresh());
    }

    public function products(Request $request, $profile_id)
    {
        $pagination = $request['paginate'] ?: '80';

        return $products = ProductResource::collection(QueryBuilder::for(FlashSale::find($profile_id)->products())
          ->allowedFilters([
              'name',
              'featured',
              AllowedFilter::scope('search', 'search_filter'),
              AllowedFilter::scope('price_between'),
              AllowedFilter::scope('is_sale'),
              AllowedFilter::scope('is_free_shipping'),
              AllowedFilter::scope('category'),
              'vendor.name',
              'sku',
              // AllowedFilter::partial('status')->default('Published'),
              'stock',
              AllowedFilter::exact('id'),
              AllowedFilter::exact('vendor_id'),
          ])
           ->defaultSort('-featured')
           ->defaultSort('-id')
           ->allowedSorts([
               AllowedSort::field('featured', 'featured'),
               AllowedSort::field('new', 'created_at'),
               'name',
               AllowedSort::field('price', 'price_after_sale'),
               AllowedSort::field('sales', 'sales_count'),
           ])
          ->paginate($pagination));
    }

    public function destroy($id)
    {
        Product::whereFlashSaleId($id)->update(['flash_sale_id' => null]);
        FlashSale::find($id)->delete();

        return $this->index();
    }
}
