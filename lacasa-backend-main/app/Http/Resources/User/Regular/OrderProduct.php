<?php

namespace App\Http\Resources\User\Regular;

use App\Http\Resources\Product\ImageResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderProduct extends JsonResource
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
            'images' => ImageResource::collection($this->images),
            'price' => $this->pivot->price,
            'quantity' => $this->pivot->quantity,
            'shipping_fees' => $this->pivot->shipping_fees,
            'subtotal' => $this->pivot->subtotal,
            'status' => $this->pivot->status,
            'vendor' => [
                'id' => $this->vendor->id,
                'email' => $this->vendor->email,
                'company_name' => $this->vendor->vendor->company_name,
                'phone' => $this->vendor->phone,
            ],
        ];
    }
}
