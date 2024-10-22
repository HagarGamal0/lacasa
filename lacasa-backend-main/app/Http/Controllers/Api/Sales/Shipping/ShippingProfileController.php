<?php

namespace App\Http\Controllers\Api\Sales\Shipping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shipping\ShippingProfile as ShippingProfileRequest;
use App\Http\Requests\Shipping\UpdateShippingProfile as UpdateShippingProfileRequest;
use App\Http\Resources\Shipping\ShippingProfileProductResource as ProductResource;
use App\Http\Resources\Shipping\ShippingProfileResource;
use App\Imports\ShippingProfileImport;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Shipping\ShippingProfile;
use Excel;
use Exception;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingProfileController extends Controller
{
    public function index()
    {
        return ShippingProfileResource::collection(QueryBuilder::for(ShippingProfile::class)
          ->allowedFilters([
              'name',
          ])
          ->paginate());
    }

    public function store(ShippingProfileRequest $request)
    {
        $profile = ShippingProfile::create(collect($request->validated())->except(['rules', 'products'])->toArray());
        try {
            $rules = $profile->shipping_rules()->createMany($request->validated()['rules']);
            //Assign Bulk Products to profile;
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
            Product::whereIn('id', $products)->update(['shipping_profile_id' => $profile->id]);
        } catch(Exception $e) {
            // $profile->delete();
            return response(['message' => $e->getMessage()], 500);

            return response(['message' => 'Something wrong happened, Please try again later..'], 500);
        }

        return new ShippingProfileResource($profile->fresh());
    }

    public function update(UpdateShippingProfileRequest $request, $id)
    {
        $profile = ShippingProfile::find($id);
        $profile->update(collect($request->validated())->except(['rules', 'products'])->toArray());
        try {
            // Update Profile Rules
            if (isset($request->validated()['rules'])) {
                foreach ($request->validated()['rules'] as $rule) {
                    $profile->shipping_rules()->updateOrCreate([
                        'city_id' => $rule['city_id'],
                    ], collect($rule)->except(['city_id'])->toArray());
                }
            }
            //Assign Bulk Products to profile;
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
            $bulk_ids = $bulk->whereNotIn('id', $products['exclude'])->values()->pluck('id');
            Product::whereIn('id', $bulk_ids)->update(['shipping_profile_id' => $profile->id]);
            $removed = 0;
            if (! empty($products['remove'])) {
                $removed = Product::whereIn('id', $products['remove'])->update(['shipping_profile_id' => 1]);
            }
        } catch(Exception $e) {
            // return response(['message' => $e->getMessage()], 500);
            return response(['message' => 'Something wrong happened, Please try again later..'], 500);
        }

        return (new ShippingProfileResource($profile->fresh()))->additional([
            'message' => 'Changes was applied successfuly, (' . $bulk->count() . ') products was re-assigned to ' . $profile->name . ' and (' . $removed . ') was removed']);
    }

    public function show($id)
    {
        return new ShippingProfileResource(ShippingProfile::find($id));
    }

    public function products(Request $request, $profile_id)
    {
        $pagination = $request['paginate'] ?: '80';

        return $products = ProductResource::collection(QueryBuilder::for(ShippingProfile::find($profile_id)->products())
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

    public function importShippingProfiles(Request $request)
    {
        $rows = Excel::import(new ShippingProfileImport, $request->file('file'));

        return 'success';
        // return redirect()->route('users.index')->with('success', 'User Imported Successfully');
    }
}
