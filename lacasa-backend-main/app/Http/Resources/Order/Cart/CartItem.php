<?php

namespace App\Http\Resources\Order\Cart;

use App\Http\Resources\Product\ImageResource;
use App\Http\Resources\Shipping\ShippingProfileRuleResource;
use Faker\Core\Number;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class CartItem extends JsonResource
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
            'commission' => $this->commission,
            'vendor_revenue' => $this->vendor_revenue,
            'name' => $this->product->name,
            'slug' => $this->product->slug,
            'image' => new ImageResource($this->product->images->first()),
            'shipping_rules' => ShippingProfileRuleResource::collection($this->shipping_rules),
            'price' => $this->price,
            'quantity' => $this->quantity,
            'shipping_fees' => (float) $this->shipping_fees,
            'total' => $this->total,
            'discounts' => $this->discounts,
            'total_discounts' => $this->total_discounts,
            'attributes' => $this->attributes,
        ];
    }
}
