<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        $item = parent::toArray($request);
        
        return [
            'data' => [
                'products' => [
                    'items' => $item ,
                ],
            ],
        ];
    }
}
