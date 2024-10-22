<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Roles\Logs;
use App\Http\Resources\User\Addressbook;
use App\Models\PaymentMethod;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class DraftOrder extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        $discounts = $this->cart->discounts;

        if($request && $request->payment_method == 2){
            $discountPaymentItems =   $this->cart->items->sum('discounts.payment_discount.value');

            $discountPayment      =   ($request->payment_method == 2 && ($this->subtotal >= PaymentMethod::OrderLIMITD)) ? ($this->subtotal * PaymentMethod::PAYMENTDiscountPrecent) : 0;
            $finalPaymentDiscount =   (($discountPayment > $discountPaymentItems)) ? $discountPaymentItems : $discountPayment;
            $payment_discount     =   $finalPaymentDiscount > PaymentMethod::PAYMENTLIMITDICOUNT ? PaymentMethod::PAYMENTLIMITDICOUNT : $finalPaymentDiscount;



            $discounts['payment_discount'] = [
                'title' => 'Payment Method Discount',
                'value' => $payment_discount,
            ];
            $discount      =   $this->cart->total_discounts + $payment_discount;
        }else{
            $discount      =   $this->cart->total_discounts;
        }
        $cartTotal =  ($this->cart->total -  $discount);

      
     
        return [
            'id' => $this->id,
            'transaction_detail' => [
                'type' => $this->payment_method->display_name,
                'status' => $this->payment_status,
                'description' => $this->payment_status_description,
                'payment_id' => $this->payment_id,
            ],
            'payment_detail' => [
                'subtotal' => $this->cart->subtotal,
                'discounts' => $discounts,
                'shipping_fees' => $this->cart->shipping_fees,
                'total' => $cartTotal,
                'down_payment' => $this->down_payment,
                'valu_down_payment' => $this->valu_down_payment,
                'to_be_collected' => $cartTotal - $this->down_payment - $this->valu_down_payment,
            ],
            'shipping_details' => [
                'shipping_address' => new Addressbook($this->address),
                'consignee' => [
                    'id' => $this->address->user->id,
                    'name' => $this->address->user->name,
                    'phone' => $this->address->user->phone,
                    'email' => $this->address->user->email,
                ],
            ],
            'notes' => $this->notes,
            'items' => OrderItem::collection($this->cart->items),
            'created_at' => $this->created_at,
            'activities' => Logs::collection($this->whenLoaded('activities')),
        ];
    }
}
