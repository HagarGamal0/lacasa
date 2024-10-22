<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Models\Sales\Order\OldOrderProduct;

class OldOrdersExport implements FromView
{
    protected $filters;

    function __construct($filters) {
            $this->filters = $filters;
    }

    public function view(): View
    {
      // return $this->filters['from_date'];
        return view('exports.old_orders', [
            'products' => OldOrderProduct::whereHas('order', function($query){
              $query
              ->whereDate('created_at', '<=', $this->filters['created_before'])
              ->whereDate('created_at', '>=', $this->filters['created_after']);
            })
            ->orderByDesc('order_id')->get()
        ]);
    }
}
