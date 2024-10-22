<?php

namespace App\Http\Resources\Order\Cart;

use App\Models\PaymentMethod;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class Cart extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        $discountPaymentItems =   $this->items->sum('discounts.payment_discount.value');

        $discountPayment      =   ($request->payment_method == 2 && ($this->subtotal >= PaymentMethod::OrderLIMITD)) ? ($this->subtotal * PaymentMethod::PAYMENTDiscountPrecent) : 0;
        $finalPaymentDiscount =   (($discountPayment > $discountPaymentItems)) ? $discountPaymentItems : $discountPayment;
        $payment_discount     =   $finalPaymentDiscount > PaymentMethod::PAYMENTLIMITDICOUNT ? PaymentMethod::PAYMENTLIMITDICOUNT : $finalPaymentDiscount;

        $shipping_discount    =   $this->items->sum('discounts.shipping_discount.value') ;
        $coupons_discount     =   $this->items->sum('discounts.coupons.value');
        $orange_discount      =   $this->items->sum('discounts.orange_discount.value');
        $payment_discount     =    $coupons_discount > 0 ? 0 : $payment_discount;
        $total_discounts      =   $payment_discount+$coupons_discount+$orange_discount;

        return [
            'id' => $this->id,
            'subtotal' => $this->subtotal,
            'shipping_fees' => $this->shipping_fees,
            'discounts' => [
                'coupons' => [
                    'title' => isset($this->items->first()->discounts['coupons']['title']) ? $this->items->first()->discounts['coupons']['title'] : null,
                    'value' => $coupons_discount,
                ],
                'orange_discount' => [
                    'title' => 'Orange Voucher',
                    'value' => $orange_discount,
                ],
                'payment_discount' => [
                    'title' => 'Payment Method Discount',
                    'value' => $payment_discount,
                ],
                'shipping_discount' => [
                    'title' => 'Shipping discount',
                    'value' => $shipping_discount,
                ],
            ],
            'total_discounts' => $total_discounts,
            'total' => ($this->total-$total_discounts),
            'items' => CartItem::collection($this->items),
        ];
        
    }
}
