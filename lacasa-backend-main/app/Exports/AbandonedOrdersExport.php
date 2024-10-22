<?php

namespace App\Exports;

use App\Models\Sales\Order\Order;
use App\Models\Sales\Order\TempOrderProduct;
// use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AbandonedOrdersExport implements FromView
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function view(): View
    {
        return view('exports.orders', [
            'products' => TempOrderProduct::whereHas('order', function ($query) {
                $query->where('payment_status', 'Unpaid')
                ->whereDate('created_at', '<=', $this->filters['created_before'])
                ->whereDate('created_at', '>=', $this->filters['created_after']);
            })->orderByDesc('temp_order_id')->get(),
        ]);
    }
}
