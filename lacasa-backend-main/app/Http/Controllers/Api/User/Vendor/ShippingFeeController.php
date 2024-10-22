<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Vendor\UpdateShippingFee;
use App\Http\Resources\Product\CategoryResource;
use App\Http\Resources\User\Vendor\ShippingFee as ShippingFeeResource;
use App\Http\Resources\World\City as CityResource;
use App\Models\Catalog\Category;
use App\Models\Sales\Shipping\ShippingFee;
use App\Models\User\User;
use App\Models\World\City;
use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingFeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        // return ShippingFeeResource::collection(Auth::user()->shipping_fees);
        return ShippingFeeResource::collection(QueryBuilder::for(Auth::user()->shipping_fees())
          ->allowedFilters([
              AllowedFilter::exact('category_id'),
          ])->get());
    }

    public function update($id, UpdateShippingFee $request)
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
                ShippingFee::updateOrCreate(
                    [
                        'city_id' => $fee['city_id'],
                        'vendor_id' => Auth::id(),
                        'category_id' => $category_id,
                    ],
                    [
                        'shipping_fees' => $fee['shipping_fees'],
                        'estimated_delivery' => $fee['estimated_delivery'],
                        'is_free' => $fee['is_free'],
                        'is_disabled' => $fee['is_disabled'],
                    ]
                );
            }
        }

        return ShippingFeeResource::collection(Auth::user()->shipping_fees);
    }

    public function usedCategories()
    {
        return CategoryResource::collection(Category::whereHas('products', function (Builder $query) {
            $query->where('vendor_id', Auth::id());
        })->doesntHave('childs')->get());
    }
}
