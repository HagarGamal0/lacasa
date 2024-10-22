<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Product\ImageResource;
use App\Http\Resources\Shipping\ShippingProfileRuleResource;
use App\Http\Resources\Shipping\ShippingProviderResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItem extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'vendor' => [
                'id' => $this->product->vendor_id,
                'name' => $this->product->vendor->vendor->company_name,
            ],
            'status' => $this->status,
            'status_history' => OrderStatusHistory::collection($this->status_history?->sortDesc()),
            'commission' => $this->commission,
            'vendor_revenue' => $this->vendor_revenue,
            'name' => $this->product->name,
            'slug' => $this->product->slug,
            'image' => new ImageResource($this->product->images->first()),
            'shipping_rules' => new ShippingProfileRuleResource($this->shipping_rules->where('city_id', $this->cart->city_id)->first()),
            'shipping_provider' => new ShippingProviderResource($this->product->shipping_profile->provider),
            'price' => $this->price,
            'quantity' => $this->quantity,
            'discounts' => $this->discounts_details,
            'shipping_fees' => (float) $this->total_shipping_fees,
            'total' => $this->total,
            'total_discounts' => $this->total_discounts,
            'attributes' => $this->attributes,
            'available_status' => $this->available_status,
        ];
    }
}
