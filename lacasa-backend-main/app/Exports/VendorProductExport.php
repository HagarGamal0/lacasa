<?php

namespace App\Exports;

use App\Models\Catalog\Product\Product;
// use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class VendorProductExport implements FromView
{
    protected $vendor_id;

    public function __construct($vendor_id)
    {
        $this->vendor_id = $vendor_id;
    }

    public function view(): View
    {
        // return $this->filters['from_date'];
        return view('exports.vendorproducts', [
            'products' => Product::whereVendorId($this->vendor_id)->whereStatus('Published')->where('stock', '>', 0)->whereRaw('description <> ""')->get(),
        ]);
    }
}
