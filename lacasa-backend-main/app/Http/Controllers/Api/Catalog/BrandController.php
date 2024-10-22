<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Product\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        // return $request;
        $pagination = $request['paginate'] ?: '8';

        return [
            'data' => QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::scope('category'),
                'brand',
                AllowedFilter::partial('status')->default('Published'),
            ])->whereNotNull('brand')
            ->whereHas('vendor.vendor', function ($query) {
                $query->whereStatus('Active');
            })
            ->pluck('brand')->unique()->values(),
        ];
    }
}
