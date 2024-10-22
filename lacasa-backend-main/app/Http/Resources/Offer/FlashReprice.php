<?php

namespace App\Http\Resources\Offer;

use App\Http\Resources\Product\Product;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class FlashReprice extends JsonResource
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
            'start_date' => $this->start_date,
            'expire_at' => $this->expire_at,
            'product' => new Product($this->product),
            'flash_price' => $this->flash_price,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
        ];
    }
}
