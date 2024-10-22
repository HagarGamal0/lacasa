<?php

namespace App\Http\Resources\Shipping;

use App\Enums\ShippingProfileType;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingProfileResource extends JsonResource
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
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => ShippingProfileType::getShippingProfileType($this->type),
            'products_count' => $this->products->count(),
            'provider' => new ShippingProviderResource($this->provider),
            'rules' => ShippingProfileRuleResource::collection($this->shipping_rules),
        ];
    }
}
