<?php

namespace App\Mail\Vendor\Order;

use App\Models\Sales\Order\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Created extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $products;
    public $order;

    public function __construct(Order $order, $products)
    {
        $this->products = $products;
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
        return $this->subject('La Casa - You have recieved a new order.')->markdown('mail.vendor.order.created');
    }
}
