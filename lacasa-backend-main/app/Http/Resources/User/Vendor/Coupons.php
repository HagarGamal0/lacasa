<?php

namespace App\Http\Resources\User\Vendor;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class Coupons extends JsonResource
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
            'exclude_products' => json_decode($this->pivot->exclude_products),
            'exclude_categories' => json_decode($this->pivot->exclude_categories),
        ];
    }
}
