<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class CategoryResource extends JsonResource
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
            'id'                =>  $this->id,
            'name'              =>  $this->name,
            'name_translate'    =>  $this->name_translate,
            'slug'              =>  $this->slug,
            'products_count'    =>  $this->products_detail['productsCount'],
            'price_average'     =>  $this->products_detail['average'],
            'image'             =>  $this->image,
            'banner'            =>  $this->banner,
            'parent_id'         =>  $this->parent_id,
            'banner_translate'  =>  $this->banner_translate,
            'order'             =>  $this->order_column,
            'tags'              =>  Tag::collection($this->whenLoaded('tags')),
            'childs'            =>  CategoryResource::collection($this->whenLoaded('childs')),
            'show_in_menu'      => $this->show_in_menu

        ];
    }
}
