<?php

namespace App\Exports;

// use App\Models\Sales\Order\OrderProduct;
// use App\Models\Sales\Order\Order;
// use App\Models\Sales\Cart\CartItem;
// // use Maatwebsite\Excel\Concerns\FromCollection;
// use App\Http\Resources\Order\Order as OrderResource;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class OrdersExport implements FromView, WithCustomCsvSettings
{
    protected $orders;

    public function __construct($orders)
    {
        $this->orders = $orders;
    }

    public function view(): View
    {
        return view('exports.orders', [
            'items' => $this->orders,
        ]);
    }
    
    public function getCsvSettings(): array
    {
        return [
            // 'output_encoding' => 'ISO-8859-1',
            'output_encoding' => 'UTF-8',
            'use_bom' => true,
        ];
    }
}
