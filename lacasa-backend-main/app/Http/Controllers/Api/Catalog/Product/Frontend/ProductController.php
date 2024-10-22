<?php

namespace App\Http\Controllers\Api\Catalog\Product\Frontend;

use Cache;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\Product as ProductResource;
use App\Models\Catalog\Product\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\Enums\SortDirection;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Helpers\RandomSort;
use App\Http\Helpers\ViewsSort;
use App\Http\Resources\Product\ProductCollection;

class ProductController extends Controller
{

    public $local;

    public function __construct()
    {
        // $this->middleware(['TrafficMonitor'])->only(['show']);
        //    $this->middleware(['auth:sanctum'])->except(['index', 'show', 'showSimilar']);
        $this->local = app()->getLocale();
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResource
     */
    public function index(Request $request)
    {
        // return $request;
        $pagination = $request['paginate'] ?: '8';
        $cacheKey = md5(serialize($request->all()));
        $cachedResponse = Cache::remember("products_{$cacheKey}_{$this->local}", 60 * 30, function () use ($request, $pagination) {
            $customSort = AllowedSort::custom('views', new ViewsSort())->defaultDirection(SortDirection::DESCENDING);
            $products = QueryBuilder::for(Product::class)
                ->allowedFilters([
                    'featured',
                    AllowedFilter::scope('name', 'name'),
                    AllowedFilter::scope('search', 'search_filter'),
                    AllowedFilter::scope('price_between'),
                    AllowedFilter::scope('is_sale'),
                    AllowedFilter::scope('is_free_shipping'),
                    AllowedFilter::scope('is_flash_free_shipping'),
                    AllowedFilter::scope('category'),
                    AllowedFilter::scope('vendors'),
                    AllowedFilter::exact('vendor.name'),
                    'shipping_profile_id',
                    'sku',
                    'brand',
                    AllowedFilter::exact('tags.name'),
                    AllowedFilter::partial('status')->default('Published'),
                    AllowedFilter::partial('vendor.vendor.status')->default('Active'),
                    AllowedFilter::exact('stock'),
                    AllowedFilter::exact('id'),
                    AllowedFilter::exact('vendor_id'),
                    AllowedFilter::scope('products', 'special_products'),
                    AllowedFilter::scope('custom_products', 'custom_products'),
                ])
                ->defaultSort($customSort,'-featured', '-id')
                ->defaultSorts([])
                ->allowedSorts([
                    AllowedSort::field('featured', 'featured'),
                    AllowedSort::field('new', 'created_at'),
                    'name',
                    AllowedSort::field('price', 'price_after_sale'),
                    $customSort,
                    AllowedSort::custom('random', new RandomSort(), 'random'),
                    AllowedSort::field('sales', 'sales_count'),
                ])
                ->paginate($pagination);

            ($products = new ProductCollection($products))->additional(['meta' => [
                'selected_category' => $request['find']['category'] ?? null,
                'price_range' => [
                    'min' => 0,
                    'max' => 500000,
                ],
            ]]);

            return $products;
        });

        return $cachedResponse;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
