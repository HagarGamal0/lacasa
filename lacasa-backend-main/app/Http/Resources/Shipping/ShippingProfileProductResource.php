<?php

namespace App\Http\Resources\Shipping;

use App\Http\Resources\Product\ImageResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ShippingProfileProductResource extends JsonResource
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
            // 'categories' => CategoryResource::collection($this->categories),
            'featured_image' => new ImageResource($this->images->first()),
            'price' => intval($this->price),
            'price_after_sale' => intval($this->price_after_sale),
            'vendor' => [
                'id' => $this->vendor->id,
                'name' => $this->vendor->name,
            ],
        ];
    }
}
