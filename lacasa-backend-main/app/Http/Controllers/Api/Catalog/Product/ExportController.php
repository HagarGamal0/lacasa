<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Exports\GoogleProductExport;
use App\Exports\ProductsExport;
use App\Exports\VendorProductExport;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product\Product;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class ExportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum'])->except(['validateByName']);
    }

      public function export(Request $request)
      {
          return Excel::download(new GoogleProductExport(), 'products.csv', \Maatwebsite\Excel\Excel::CSV, [
              'Content-Type' => 'text/csv',
          ]);
      }

      public function exportByVendor(Request $request)
      {
          $vendor_id = $request['vendor_id'];

          return Excel::download(new VendorProductExport($vendor_id), 'products.csv', \Maatwebsite\Excel\Excel::CSV, [
              'Content-Type' => 'text/csv',
          ]);
      }

      public function exportForAdmin(Request $request)
      {
          $products = QueryBuilder::for(Product::with(['attribute_values', 'categories', 'vendor']))
              ->allowedFilters([
                  'name',
                  'featured',
                  AllowedFilter::scope('search', 'search_filter'),
                  AllowedFilter::scope('price_between'),
                  AllowedFilter::scope('is_sale'),
                  AllowedFilter::scope('is_free_shipping'),
                  AllowedFilter::scope('is_flash_free_shipping'),
                  AllowedFilter::scope('category'),
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
              ])
              ->defaultSort('-featured', '-id')
              ->allowedSorts([
                  AllowedSort::field('featured', 'featured'),
                  AllowedSort::field('new', 'created_at'),
                  'name',
                  AllowedSort::field('price', 'price_after_sale'),
                  AllowedSort::field('sales', 'sales_count'),
              ])
              ->get();

          return Excel::download(new ProductsExport($products), 'products.csv', \Maatwebsite\Excel\Excel::CSV, [
              'Content-Type' => 'text/csv',
          ]);
      }
}
