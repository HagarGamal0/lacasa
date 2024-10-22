<?php

namespace App\Http\Resources\User\Vendor;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderProduct extends JsonResource
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
            'slug' => $this->slug,
            'sku' => $this->sku,
            'name' => $this->name,
            'attributes' => json_decode($this->pivot->attributes),
            'status' => $this->pivot->status,
            'original_price' => intval($this->price),
            'price_after_sale' => intval($this->price_after_sale),
            'order_price' => $this->pivot->price,
            'coupon_discount' => $this->pivot->coupon_discount,
            'quantity' => $this->pivot->quantity,
            'purchased_price' => $this->pivot->purchase_price,
            'shipping_fees' => $this->pivot->shipping_fees,
            'total' => $this->pivot->subtotal,
            // 'commission_fee' => $this->pivot->commission,
            'revenue' => $this->pivot->vendor_revenue,
        ];
    }
}
