<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;

class Review extends JsonResource
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
        return [
            'id' => $this->id,
            'status' => $this->status,
            'user' => [
                'name' => $this->user->name,
                'tag' => $this->tag,
            ],
            'content' => [
                'title' => $this->title,
                'description' => $this->description,
            ],
            'images' => ImageResource::collection($this->images),
            'stars' => $this->stars,
            'product' => $this->when($this->relationLoaded('product'), function () {
                return [
                    'id' => $this->product->id,
                    'slug' => $this->product->slug,
                    'image' => new ImageResource($this->product->images->first()),
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
