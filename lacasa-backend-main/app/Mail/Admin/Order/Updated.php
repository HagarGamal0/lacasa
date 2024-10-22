<?php

namespace App\Mail\Admin\Order;

use App\Models\Sales\Order\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Updated extends Mailable
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
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('La Casa - Order # ' . $this->order->id . ' - ' . $this->product->name . ' (' . $this->product->pivot->status . ').')->markdown('mail.admin.order.updated');
    }
}
