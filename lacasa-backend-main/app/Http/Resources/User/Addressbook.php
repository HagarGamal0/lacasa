<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class Addressbook extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'area' => $this->area->name,
            'city' => $this->city->name,
            'area_id' => $this->area->id,
            'city_id' => $this->city->id,
            'default' => $this->default,
            'apartment_no' => $this->apartment_no,
            'building_no' => $this->building_no,
            'floor_no' => $this->floor_no,
            'street' => $this->street,
        ];
    }
}
