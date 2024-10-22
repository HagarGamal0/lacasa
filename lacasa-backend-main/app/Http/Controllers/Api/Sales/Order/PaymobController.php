<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Services\Orders\CartService;
use App\Http\Services\Orders\ManageOrder;
use App\Mail\User\Order\Created as OrderCreatedMail;
// use App\Models\Sales\Order\TempOrder;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\DraftOrder;
use App\Models\Sales\Order\Order;
use Illuminate\Http\Request;
use Redirect;
use Storage;

class PaymobController extends Controller
{
    public $cartService;
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }
    public function callbackProccessed(Request $request)
    {
        \Log::channel('paymob')->info(PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL);
        \Log::channel('paymob')->info('Logged By:callbackProccessed');
        \Log::channel('paymob')->info($request);
        $file = \Storage::put('public/callbackProccessed.txt', $request);
        $payment_order_id = $request->obj['order']['id'];
        $transaction_id = $request->obj['id'];
        // $payment_order_id;
        $temp_order = DraftOrder::where('payment_order_id', $payment_order_id)->first();
        $temp_order->update([
            'payment_id' => $transaction_id,
            // 'paymob_response' => $request->obj,
        ]);

        if ($request->obj['success']) {
            $temp_order->update(['payment_status' => 'Paid',
                'payment_status_description' => 'Paid With Paymob (' . $temp_order->payment_id . ')',
                'valu_down_payment' => $request->obj['data']['down_payment'] ?? 0,
                // 'payment_type' => isset($request->obj['data']['klass']) ? $request->obj['data']['klass'] : null,
            ]);
            $order = (new ManageOrder())->releaseTemp($temp_order);
            // $order = (new ManageOrder())->releaseTemp($order);
            \Mail::to($order->user->email)->send(new OrderCreatedMail($order));
        }
        $temp_order->update(['payment_status' => $request->obj['data']['message']]);
    }

    public function callbackResponse(Request $request)
    {
        \Log::channel('paymob')->info(PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL);
        \Log::channel('paymob')->info('Logged By:callbackResponse');
        \Log::channel('paymob')->info($request);
        $temp_order = DraftOrder::find($request['merchant_order_id']);
        if ('true' === $request['success']) {
            if ($temp_order) {
                $order = (new ManageOrder())->releaseTemp($temp_order);
            } else {
                $order = Order::wherePaymentId($request['id'])->first();
            }
            if ($order) {
                $order->update([
                    'payment_status' => 'Paid',
                    'payment_status_description' => $request['txn_response_code'],
                    'valu_down_payment' => $request->obj['data']['down_payment'] ?? 0,
                    // 'payment_type' => isset($request->obj['data']['klass']) ? $request->obj['data']['klass'] : null,
                ]);

                $this->cartService->updateProductsStock($order->cart->items);
              

                return \Redirect::intended(config('app.front_url') . '/page/order-success?order=' . $order->id . '&status=' . $request['success']);
            }
        } else {
            // return $message = $request['data'];
            if (isset($request['data.message'])) {
                $message = $request['data.message'];
            } else {
                $message = 'Payment Failed';
            }
            // return $order;
            return \Redirect::intended(config('app.front_url') . '/page/account/checkout?order=' . $temp_order->id . '&status=' . $request['success'] . '&message=' . $message);
            // return Redirect::intended(config('app.front_url') . '/page/account/checkout?order=&status=' . $request['success'].'&message='.$request);
        }

        return $request;
    }

    public function callbackResponseTest(Request $request)
    {
        $req = 'asdasda';
        $file = \Storage::put('public/callbackResponseTest.txt', $req);
    }

    // public function copyFromTemp($id)
    // {
    //   $temp_order = TempOrder::find($id);
    //   $order = $this->transfareFromTemp($temp_order->id);
    //   $order->update(['payment_status' => 'Paid', 'payment_status_description' => 'Paid']);
    //   foreach($order->products as $product)
    //   {
  //     Product::find($product['id'])->update(['stock' => DB::raw( "stock - ".$product->pivot->quantity."" )]);
    //   }
    // }
}
