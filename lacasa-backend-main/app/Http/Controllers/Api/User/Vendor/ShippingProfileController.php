<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Vendor\UpdateDefaultShippingFee;
use App\Http\Resources\Shipping\ShippingProfileResource;
use App\Models\Sales\Shipping\ShippingProfile;
use Auth;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $shipping = ShippingProfile::whereHas('products', function ($query) {
            $query->whereVendorId(Auth::id());
        });

        return ShippingProfileResource::collection(QueryBuilder::for($shipping)
          ->allowedFilters([
              'name',
          ])
          ->paginate());
    }

    public function show($id)
    {
        return new ShippingProfileResource(ShippingProfile::whereHas('products', function ($query) {
            $query->whereVendorId(Auth::id());
        })->find($id));
    }

    public function update(UpdateDefaultShippingFee $request, $id)
    {
        $profile = ShippingProfile::whereHas('products', function ($query) {
            $query->whereVendorId(Auth::id());
        })->find($id);
        $profile->update(collect($request->validated())->except(['rules', 'products'])->toArray());
        if (isset($request->validated()['rules'])) {
            foreach ($request->validated()['rules'] as $rule) {
                $profile->shipping_rules()->updateOrCreate([
                    'city_id' => $rule['city_id'],
                ], collect($rule)->except(['city_id'])->toArray());
            }
        }

        return $this->show($id);
    }
}
