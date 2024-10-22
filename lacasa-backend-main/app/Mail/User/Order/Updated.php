<?php

namespace App\Mail\User\Order;

use App\Models\Sales\Order\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
// use App\Models\Sales\Order\OrderProduct;
use Illuminate\Queue\SerializesModels;

class Updated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $product;
    public $order;

    public function __construct(Order $order, $product)
    {
        $this->product = $product;
        // $product = OrderProduct::whereProductId($product_id)
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('La Casa - Order # ' . $this->order->id . ' - ' . $this->product->name . ' (' . $this->product->pivot->status . ').')->markdown('mail.user.order.updated');
    }
}
