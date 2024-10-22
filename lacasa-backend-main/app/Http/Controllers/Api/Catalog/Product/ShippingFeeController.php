<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Vendor\UpdateDefaultShippingFee;
use App\Http\Requests\User\Vendor\UpdateShippingFee;
use App\Http\Resources\Product\CategoryResource;
use App\Http\Resources\Product\DefaultShippingFeeResource;
use App\Http\Resources\User\Vendor\ShippingFee as ShippingFeeResource;
use App\Http\Resources\World\City as CityResource;
use App\Models\Catalog\Category;
use App\Models\DefaultShippingFee;
use App\Models\Sales\Shipping\ShippingFee;
use App\Models\User\User;
use App\Models\World\City;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingFeeController extends Controller
{
    /**
     *  Default Shipping Settings
     */
    public function index()
    {
        return DefaultShippingFeeResource::collection(QueryBuilder::for(DefaultShippingFee::class)
        ->allowedFilters([
            AllowedFilter::exact('category_id'),
        ])->get());
        // return QueryBuilder::for(DefaultShippingFee::class);
    }

    public function update(UpdateDefaultShippingFee $request)
    {
        $fees = $request->validated();
        $cities_ids = City::all()->pluck('id');
        $request_cities_ids = collect($fees['shipping'])->pluck('city_id');
        if ($cities_ids != $request_cities_ids) {
            throw ValidationException::withMessages([
                'missing_cities' => CityResource::collection(City::whereIn('id', $cities_ids->diff($request_cities_ids)->values())->get()),
            ]);
        }
        foreach ($fees['categories'] as $category_id) {
            foreach ($fees['shipping'] as $fee) {
                DefaultShippingFee::updateOrCreate([
                    'city_id' => $fee['city_id'],
                    'category_id' => $category_id,
                ],
                    // [
            //     'shipping_fees' => $fee['shipping_fees'],
            //     'estimated_delivery' => $fee['estimated_delivery'],
                    // ]
                    // [
                    //   'shipping_fees' => $fee['shipping_fees'],
                    // ],

                    collect($fee)->only(['shipping_fees', 'estimated_delivery', 'is_disabled', 'is_free'])->toArray()
                );
            }
        }

        return DefaultShippingFeeResource::collection(DefaultShippingFee::whereCategoryId($category_id)->get());
    }

    /**
     *  Vendor Shipping Settings
     */
    public function vendor_index($id)
    {
        return ShippingFeeResource::collection(QueryBuilder::for(User::find($id)->shipping_fees())
        ->allowedFilters([
            AllowedFilter::exact('category_id'),
        ])->get());
    }

    public function vendor_update($id, UpdateShippingFee $request)
    {
        if (! User::find($id)->is_vendor()) {
            throw new AuthenticationException;
        }
        $fees = $request->validated();
        $cities_ids = City::all()->pluck('id');
        $request_cities_ids = collect($fees['shipping'])->pluck('city_id');
        if ($cities_ids != $request_cities_ids) {
            throw ValidationException::withMessages([
                'missing_cities' => CityResource::collection(City::whereIn('id', $cities_ids->diff($request_cities_ids)->values())->get()),
            ]);
        }
        foreach ($fees['categories'] as $category_id) {
            if (Category::find($category_id)->doesntHave('childs')) {
                foreach ($fees['shipping'] as $fee) {
                    if (! isset($fee['shipping_fees'])) {
                        $fee['shipping_fees'] = DefaultShippingFee::whereCityId($fee['city_id'])->whereCategoryId($category_id)->first()->shipping_fees;
                    }
                    ShippingFee::updateOrCreate([
                        'city_id' => $fee['city_id'],
                        'vendor_id' => $id,
                        'category_id' => $category_id,
                    ], collect($fee)->only(['shipping_fees', 'estimated_delivery', 'is_disabled', 'is_free'])->toArray()
                    );
                }
            }
        }

        return ShippingFeeResource::collection(User::find($id)->shipping_fees()->whereCategoryId($category_id)->get());
    }

    public function usedCategories($id)
    {
        return CategoryResource::collection(Category::whereHas('products', function (Builder $query) use ($id) {
            $query->where('vendor_id', $id);
        })->doesntHave('childs')->get());
    }

    public function intialize_shipping_all_cats()
    {
        foreach (Category::all() as $category) {
            foreach (City::all() as $city) {
                DefaultShippingFee::updateOrCreate([
                    'city_id' => $city->id,
                    'category_id' => $category->id,
                ],
                    [
                        'shipping_fees' => '0',
                    ]);
                // }
            }
        }
    }

    public function intialize_shipping($id)
    {
        if (Category::find($id)) {
            foreach (City::all() as $city) {
                DefaultShippingFee::updateOrCreate([
                    'city_id' => $city->id,
                    'category_id' => $id,
                ],
                    [
                        'shipping_fees' => '0',
                    ]);
            }
        }
    }
}
