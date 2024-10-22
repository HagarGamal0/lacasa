<?php

namespace App\Http\Resources\FlashSale;

use App\Http\Resources\Shipping\ShippingProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class FlashSaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'campaign_name' => $this->campaign_name,
            'expire_at' => $this->expire_at,
            'precentage_discount' => $this->precentage_discount,
            'products_count' => $this->products->count(),
            // 'products' => ProductResource::collection($this->whenloaded('products')),
            'has_shipping_profile' => $this->has_shipping_profile,
            'shipping_profile' => $this->shipping_profile,
            // 'shipping_profile' => $this->has_shipping_profile ? new ShippingProfileResource($this->shipping_profile) : null,

        ];
    }
}
