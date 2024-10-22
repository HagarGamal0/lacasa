<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\PaymentMethodsRequest;
use App\Http\Resources\Order\PaymentMethod as PaymentMethodResource;
use App\Models\Catalog\Product\Product;
use App\Models\PaymentMethod;
use Illuminate\Validation\ValidationException;
// DEORECATED;;
class PaymentMethodController extends Controller
{
    public function index()
    {
        return PaymentMethodResource::collection(PaymentMethod::all());
    }

    public function getPaymentMethods(PaymentMethodsRequest $request)
    {
        $payment_methods = PaymentMethod::all()->sortBy('order');
        // foreach ($request->validated()['products'] as $product) {

        //     foreach (Product::find($product['id'])->categories()->get() as $category) {
        //         if ($category->name == 'APPLIANCES') {
        //             $remove_items = $payment_methods->WhereIn('iframe_id', ['341359','738258', '737646', '736826'])->keys();
        //             foreach ($remove_items as $remove_item) {
        //                 $payment_methods->forget($remove_item);
        //             }
        //         }else{
        //             throw ValidationException::withMessages([
        //                 'coupon' => __('remove this product to make use this Payment',['product'=>$product->name]),
        //             ]);
        //         }
        //     }
        // }

        return PaymentMethodResource::collection($payment_methods);
    }
}
