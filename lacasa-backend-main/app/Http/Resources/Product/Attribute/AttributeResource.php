<?php

namespace App\Http\Resources\Product\Attribute;

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
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'values' => AttributeValueResource::collection($this->whenLoaded('values')),
        ];
    }
}
