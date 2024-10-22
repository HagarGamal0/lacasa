<?php

namespace App\Exports;

use App\Models\Catalog\Product\Product;
// use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class GoogleProductExport implements FromView
{
    public function view(): View
    {
        return view('exports.googleproducts', [
            'products' => Product::whereStatus('Published')->where('stock', '>', 0)->whereRaw('description <> ""')->take(4000)->get(),
        ]);
    }
}
