<?php

namespace App\Http\Resources\DynamicData;

use App\Http\Resources\Product\ImageResource as Image;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class DynamicItem extends JsonResource
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
            'id'                     => $this->id,
            'title'                  => $this->title,
            'title_translate'        =>  $this->title_translate,
            'subtitle'               => $this->subtitle,
            'subtitle_translate'     =>  $this->subtitle_translate,
            'description'            => $this->description,
            'description_translate'  => $this->description_translate,
            'link'                   => $this->link,
            'image'                  => $this->image,
            'image_translate'        => $this->image_translate,
            'mobile_image'           => $this->mobile_image,
            'mobile_image_translate' => $this->mobile_image_translate,
            'section'                => new DynamicSection($this->whenLoaded('section')),
            'order'                   => $this->order,
        ];
    }
}
