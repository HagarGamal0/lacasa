<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Models\Sales\Order\OldTempOrderProduct;
use DB;
class oldAbandonedOrdersExport implements FromView
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function view(): View
    {
        return view('exports.old_orders', [
            'products' => OldTempOrderProduct::whereHas('order', function ($query) {
                                    $query->where('payment_status', 'Unpaid')
                                    ->whereDate('created_at', '<=', $this->filters['created_before'])
                                    ->whereDate('created_at', '>=', $this->filters['created_after']);
                                })->orderByDesc('temp_order_id')->get(),
                            ]);
    }

}
