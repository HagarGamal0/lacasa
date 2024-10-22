<?php

namespace App\Http\Resources\User\Designer;

use App\Http\Resources\Product\ImageResource;
use App\Http\Resources\User\DesignerResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class Project extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        // return $t
        return [
            'id'          => $this->id,
            'designer_id' => $this->designer_id,
            'designer'    => $this->designer? new DesignerResource($this->designer) :null,
            'title'       => $this->title,
            'description' => $this->description,
            'gallery'     => ImageResource::collection($this->images),
        ];
    }
}
