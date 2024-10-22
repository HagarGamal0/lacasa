<?php

namespace App\Http\Resources\Offer;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class WheelOffer extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'value' => $this->value,
            'color' => $this->color,
            'is_winable' => $this->is_winable,
            'coupon' => $this->whenLoaded('coupon'),
        ];
    }
}
