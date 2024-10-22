<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\Roles\Logs;
use App\Http\Resources\Shipping\ShippingProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Product extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'name' => $this->name,
            'name_translate' =>  $this->name_translate,
            'brand' => $this->brand,
            'featured' => $this->featured,
            'status' => $this->status,
            'stock' => $this->stock > 0 && 'Published' === $this->status && 'Active' === $this->vendor->vendor->status ? true : false,
            'quantity' => $this->stock,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'description' => $this->description,
            'description_translate' =>  $this->description_translate,
            'short_description' => $this->short_description,
            'short_description_translate' =>  $this->short_description_translate,
            'meta_title' =>  $this->meta_title,
            'meta_title_translate' =>  $this->meta_title_translate,
            'meta_description' =>  $this->meta_description,
            'meta_description_translate' =>  $this->meta_description_translate,
            'meta_keywords' =>  $this->meta_keywords,
            'meta_keywords_translate' =>  $this->meta_keywords_translate,
            'images' => ImageResource::collection($this->images),
            'price' => (int)($this->price),
            'price_after_sale' => (int)($this->price_after_sale),
            'save' => $this->save,
            'discount' => $this->discount,
            'discount_type' => $this->discount_type,
            'attributes' => AttributeResource::collection($this->attribute_values)->collection->groupBy('attribute.name')->values(),
            'is_free' => $this->is_free,
            'shipping_profile' => new ShippingProfileResource($this->whenLoaded('shipping_profile')),
            'tags' => Tag::collection($this->whenLoaded('tags')),
            'vendor' => [
                'id' => optional($this->vendor)->id,
                'name' => optional($this->vendor)->name,
            ],
            'activities' => Logs::collection($this->whenLoaded('activities')),
            'reviews' => Review::collection($this->whenLoaded('approved_reviews')),
            'rating' => $this->when($this->relationLoaded('approved_reviews'), function () {
                return [
                    'detailed' => $this->approved_reviews->groupBy('stars')->map(function ($review, $key) {
                        $percentage = ($review->count() / $this->approved_reviews->count()) * 100;

                        return [
                            'key' => $key . ' stars',
                            'value' => $percentage,
                        ];
                    })->values()->sortByDesc('key')->values(),
                    'average' => $this->approved_reviews->avg('stars'),
                ];
            }),
            'clicks' => $this->clicks,
            'order' => $this->order,
        ];
    }
}
