<?php

namespace App\Http\Controllers\Api\Sales\Shipping;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shipping\ShippingProviderResource;
use App\Models\Sales\Shipping\ShippingProvider;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingProviderController extends Controller
{
    public function index()
    {
        return ShippingProviderResource::collection(QueryBuilder::for(ShippingProvider::class)
            ->allowedFilters([
                'name',
            ])
            ->paginate());
    }

    public function show($id)
    {
        return new ShippingProviderResource(QueryBuilder::for(ShippingProvider::class)
            ->allowedFilters([
                'name',
            ])
            ->find($id));
    }
}
