<?php

namespace App\Imports;

use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Order\Order;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;
use Maatwebsite\Excel\Concerns\ToCollection;

class OrdersUpdateImport implements ToCollection
{

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            try {
                $order = Order::find($row[0]);
                $cart_id = $order->cart_id;
                if($cart_id) {
                    CartItem::where([
                        'cart_id' => $cart_id,
                        'status' => trim($row[1])
                    ])->update(['status' => trim($row[2])]);
                }
            } catch (\Throwable $th) {
                dd($th->getMessage(), $row);
            }
        }
    }
}
