<?php

namespace App\Http\Resources\Shipping;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ShippingProfileRuleResource extends JsonResource
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
            'city' => [
                'id' => $this->city->id,
                'name' => $this->city->name,
            ],
            'fee' => $this->shipping_fee,
            'is_disabled' => $this->is_disabled,
            'estimated_delivery' => $this->estimated_delivery,
        ];
    }
}
