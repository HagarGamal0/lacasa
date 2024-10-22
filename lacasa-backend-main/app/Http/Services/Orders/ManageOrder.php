<?php

namespace App\Http\Services\Orders;

use App\Mail\User\Order\Created as UserOrderCreatedMail;
use App\Models\Sales\Offer\OrangeVoucher;
use App\Models\Sales\Order\DraftOrder;
use App\Models\Sales\Order\Order;
use Mail;

class ManageOrder
{
    public function createOrder($type, $order)
    {
        $newOrder = 'DraftOrder' === $type ? new DraftOrder() : new Order();
        $newOrder->cart_id = $order->cart->id;
        $newOrder->notes = $order->cart->notes;
        $newOrder->payment_method_id = $order->payment->id;
        $newOrder->address_book_id = $order->address->id;
        $newOrder->user_id = $order->address->user->id;
        $newOrder->commission = 0;
        $newOrder->vendor_revenue = 0;
        $newOrder->payment_status = 'cod' === $order->payment->name ? 'Paid' : 'Unpaid';
        $newOrder->save();
        $order->cart->update([
            'status' => $type,
            'orderable_type' => \get_class($newOrder),
            'orderable_id' => $newOrder->id,
        ]);

        return $newOrder->fresh();
    }

    public function releaseTemp(DraftOrder $draft_order)
    {
        $order = $draft_order->replicate()->setTable('orders');
        $order->save();
        $order->cart()->update([
            'status' => 'Order',
            'orderable_type' => \get_class(new Order()),
            'orderable_id' => $order->id,
        ]);
        $draft_order->delete();
        // Send mail to user
        $order = Order::find($order->id);

        $this->sendOrderMail($order);

        return $order;
    }

    public function sendOrderMail(Order $order){
        try {
            \Mail::to($order->user->email)->send(new UserOrderCreatedMail($order->fresh()));
            \Mail::to('shop@lacasa-egy.com')->send(new UserOrderCreatedMail($order->fresh()));
        }catch (\Exception $e){
            return false;
        }
    }

    public function updateStatus(Order $order)
    {
        $statuses = $order->cart->items->groupBy('status');
        if (1 === $statuses->count()) {
            $order->update(['status' => $statuses->first()[0]->status]);
        } else {
            $order->update(['status' => 'Processing']);
        }
    }
}
