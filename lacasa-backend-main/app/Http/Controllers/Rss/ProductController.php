<?php

namespace App\Http\Controllers\Rss;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Product\Product;

class ProductController extends Controller
{
    public function index($product = "")
    {
        return view('rss.products.index', [
          'products' => Product::whereStatus('Published')
          ->where('stock', '>', 0)->when($product,function ($query , $product){
                  if($product != ""){
                      $query->where('id',$product);
                  }
              })
          ->whereHas('vendor', function ($query){
            $query->whereHas('vendor', function ($query){
              $query->whereStatus('Active');
            });
          })
          ->orderBy('id', 'DESC')->get()
        ]);
        // return view('rss.products.index', ['products' => Product::first()]);
    }
}
