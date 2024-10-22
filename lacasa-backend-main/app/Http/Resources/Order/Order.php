<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Roles\Logs;
use App\Http\Resources\User\Addressbook;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\PaymentMethod;
use JsonSerializable;

class Order extends JsonResource
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
                'subtotal' => $this->cart->subtotal ?? 0,
                'discounts' => $this->cart->discounts ?? 0,
                'shipping_fees' => $this->cart->shipping_fees ?? 0,
                'total' => $cartTotal ??0,
                'down_payment' => $this->down_payment,
                'valu_down_payment' => $this->valu_down_payment,
                'to_be_collected'   => $cartTotal ??0 - $this->down_payment??0 - $this->valu_down_payment??0,
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
            'status' => $this->status,
            'notes' => $this->notes,

            'items' =>OrderItem::collection($this->cart->items->filter(function ($item) {
                return $item['shipment'] == null;
            })->values()) ,
            'shipments' => OrderShipment::collection($this->shipments?->filter(function ($shipment) {
                return count($shipment['items']) > 0;
            })->values()),

            'created_at' => $this->created_at,
            'activities' => Logs::collection($this->whenLoaded('activities')),
            'referral' => $this->referral,

        ];
    }
}
