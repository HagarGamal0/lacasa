<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Product\ImageResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OldOrderProduct extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'attributes' => json_decode($this->pivot->attributes),
            'images' => ImageResource::collection($this->images),
            'status' => $this->pivot->status,
            'price' => $this->pivot->price,
            'coupon_discount' => $this->pivot->coupon_discount,
            'purchase_price' => $this->pivot->purchase_price,
            'quantity' => $this->pivot->quantity,
            'shipping_fees' => $this->pivot->shipping_fees,
            'shipping_notes' => $this->pivot->shipping_notes,
            'subtotal' => $this->pivot->subtotal,
            'total' => $this->pivot->subtotal + $this->pivot->shipping_fees,
            'commission' => $this->pivot->commission,
            'vendor_revenue' => $this->pivot->vendor_revenue,
            'vendor' => [
                'id' => $this->vendor->id,
                'email' => $this->vendor->email,
                'company_name' => $this->vendor->vendor?->company_name,
                'phone' => $this->vendor->phone,
            ],
        ];
    }
}
