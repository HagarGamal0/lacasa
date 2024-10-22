<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Exports\Vendor\OrdersExport;
use App\Exports\Vendor\ProductsExport;
use App\Http\Controllers\Controller;
use App\Models\Sales\Order\OrderProduct;
use Auth;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class ExportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function orders()
    {
        $orders = QueryBuilder::for(OrderProduct::whereHas('product', function ($query) {
            $query->whereVendorId(Auth::id());
        })->with('product', function ($query) {
            $query->where('vendor_id', Auth::id());
        }))->allowedFilters([
            'status',
            AllowedFilter::Exact('payment_status'),
            'payment_method.display_name',
            'user.name',
            'user.phone',
            AllowedFilter::Exact('id'),
            AllowedFilter::scope('is_valid'),
            AllowedFilter::scope('created_before'),
            AllowedFilter::scope('created_after'),
            AllowedFilter::scope('total_from'),
            AllowedFilter::scope('total_to'),
            'product.name',
        ])
              // ->defaultSort('-id')
              ->get();

        return Excel::download(new OrdersExport($orders), 'orders - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function products()
    {
        $products = QueryBuilder::for(Auth::user()->products())
          // ->where('status', 1)
          // ->where('parent_id', 0)
          ->allowedFilters([
              AllowedFilter::Exact('id'),
              'name',
              'featured',
              'status',
              AllowedFilter::scope('price_between'),
              AllowedFilter::scope('is_sale'),
              AllowedFilter::scope('category'),
          ])
           ->allowedSorts([
               AllowedSort::field('new', 'created_at'),
               'name',
               AllowedSort::field('price', 'price_after_sale'),
           ])
          ->get();

        return Excel::download(new ProductsExport($products), 'products.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
