<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class AttributeResource extends JsonResource
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
            'attribute' => $this->attribute->name,
            'type' => $this->attribute->type,
            'value' => $this->attribute->type != 'text' ? $this->value : '0',
            'price' => $this->pivot->price,
            'price_after_sale' => $this->pivot->price_after_sale,
            'value_id' => $this->id,
        ];
    }
}
