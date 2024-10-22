<?php

namespace App\Exports\Vendor;

// use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ProductsExport implements FromView
{
    protected $products;

    public function __construct($products)
    {
        $this->products = $products;
    }

    public function view(): View
    {
        // return $this->filters['from_date'];
        return view('exports.vendorproducts', [
            'products' => $this->products,
        ]);
    }
}
