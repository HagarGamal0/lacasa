<?php

namespace App\Http\Resources\DynamicData;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class HomeSliderResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'link' => $this->link,
            'image' => $this->image?->url,
            'mobile_image' => $this->mobile_image?->url,
            'order' => $this->order,
        ];
    }
}