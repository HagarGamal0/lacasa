<?php

namespace App\Http\Controllers\Api\Sales\Cart;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\PaymentMethod as PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Models\Sales\Cart\Cart;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index(Request $request, Cart $cart)
    {
        $payment_methods = PaymentMethod::all()->sortBy('order');

        // foreach ($cart->items as $item) {
        //     foreach ($item->product->categories()->get() as $category) {
        //         if ($category->name == 'APPLIANCES') {
        //             $remove_items = $payment_methods->whereIn('iframe_id',  ['341359','738258', '737646', '736826'])->keys();
        //             foreach ($remove_items as $remove_item) {
        //                 $payment_methods->forget($remove_item);
        //             }
        //         }
        //     }
        // }

        return PaymentMethodResource::collection($payment_methods);
    }
}
