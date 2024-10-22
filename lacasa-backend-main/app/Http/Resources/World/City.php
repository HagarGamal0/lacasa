<?php

namespace App\Http\Resources\World;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use Illuminate\Support\Facades\App;
class City extends JsonResource
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
            'id'             => $this->id,
            'name'           =>  request()->header('X-localization') == 'ar' ? $this->ar_name : $this->name,
            'name_translate' => $this->name_translate,
        ];
    }
}
