<?php

namespace App\Http\Resources\DynamicData;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class CountBanner extends JsonResource
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
            'link_title' => $this->link_title,
            'start_date' => $this->start_date,
            'expire_date' => $this->expire_date,
            'color' => $this->color,
            'link' => $this->link,
            'image_url' => $this->image_url,
            'order'                   => $this->order,
        ];
    }
}
