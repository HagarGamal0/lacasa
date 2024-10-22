<?php

namespace App\Http\Resources\FlashSale;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        // If it's a single instance
        if (!$this->resource instanceof ResourceCollection) {
            return [
                'id' => $this->id,
                'slug' => $this->slug,
                'name' => $this->name,
                'featured_image' => $this->images()?->first()?->url,
            ];
        }

        // If it's a collection
        return $this->collection->map(function ($product) {
            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'featured_image' => $product->images()?->first()?->url,
            ];
        })->toArray();
    }
}
