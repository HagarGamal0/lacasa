<?php

namespace App\Http\Resources\User\Vendor;

use App\Http\Resources\Product\CategoryResource as Category;
use App\Http\Resources\World\City;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ShippingFee extends JsonResource
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
            'vendor' => $this->vendor->vendor->company_name,
            'city' => new City($this->city),
            'category' => new Category($this->category),
            'shipping_fees' => $this->shipping_fees,
            'estimated_delivery' => $this->estimated_delivery,
            'is_disabled' => $this->is_disabled,
            'is_free' => $this->is_free,
        ];
    }
}
