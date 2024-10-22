<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Roles\Logs;
use App\Http\Resources\User\Addressbook;
// use App\Http\Resources\User\Vendor\OrderProductCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OldOrder extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            // 'status_history' => isset($this->status_history) ? OrderStatusHistory::collection($this->status_history->sortByDesc('id')) : [],
            'payment_method' => new PaymentMethod($this->payment_method),
            'payment_status' => $this->payment_status,
            'payment_status_description' => $this->payment_status_description,
            'payment_id' => $this->payment_id,
            'valu_down_payment' => $this->valu_down_payment,
            'down_payment' => $this->down_payment,
            'payment_type' => $this->payment_type,
            'address' => new Addressbook($this->address),
            'products' => new OldOrderProductCollection($this->products),
            // 'address' => $this->address,
            'status' => $this->status,
            'notes' => $this->notes,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'original_subtotal' => $this->original_subtotal,
            'coupon' => [
                'id' => $this->coupon?->id,
                'code' => $this->coupon?->coupon_code,
                'discount' => $this->coupon_discount,
            ],
            'discounts' => [
                'coupons' => $this->coupon_discount,
                'flash_sale' => $this->flash_sale_discount,
                'payment_method_discount' => $this->payment_method_discount,
                'orange_voucher' => $this->orange_voucher?->value,
                'total' => $this->coupon_discount + $this->flash_sale_discount + $this->payment_method_discount,
            ],
            'subtotal' => $this->subtotal,
            'shipping' => [
                'original_shipping' => $this->shipping_fees + $this->shipping_discount,
                'shipping_discount' => $this->shipping_discount,
                'purchased_shipping' => $this->shipping_fees,
            ],
            // 'coupon_discount' => $this->coupon_discount,
            'shipping_fees' => (float)$this->shipping_fees,
            'orange_discount' => $this->orange_voucher?->value,
            'total' => $this->total,
            'lacasa_commission' => $this->commission,
            'vendor_revenue' => $this->vendor_revenue,
            'created_at' => $this->created_at,
            'activities' => Logs::collection($this->whenLoaded('activities')),
        ];
    }
}
