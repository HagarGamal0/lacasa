<?php

namespace App\Http\Resources\User\Designer;

use App\Enums\ProfessionalCategoryType;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
class Category extends JsonResource
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
            'id'                    => $this->id,
            'type'                  => ProfessionalCategoryType::getProfessionalCategoryType($this->type),
//            'type'                  => (int) $this->type,
            'name'                  =>  $this->name,
            'name_translate'        =>  $this->name_translate,
            'description'           =>  $this->description,
            'description_translate' =>  $this->description_translate,
            'image'                 => $this->image,
            'image_translate'       =>  $this->image_translate,
            'childs'                => Category::collection($this->whenLoaded('childs')),
        ];
    }
}
