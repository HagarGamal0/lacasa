<?php

namespace App\Http\Resources\User;

use App\Enums\DesignerStatusType;
use App\Http\Resources\User\Designer\Category;
use App\Http\Resources\User\Designer\Project;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use App\Enums\ProfessionalCategoryType;
use Spatie\Permission\Models\Permission;

class DesignerResource extends JsonResource
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
            'id'                        => $this->user->id,
            'type'                      => ProfessionalCategoryType::getProfessionalCategoryType($this->type),
            'name'                      => $this->user->name,
            'email'                     => $this->user->email,
            'phone'                     => $this->user->phone,
            'company_name'              => $this->company_name,
            'company_name_translate'    => $this->company_name_translate,
            'job_title'                 => $this->job_title,
            'job_title_translate,'      => $this->job_title_translate,
            'bio'                       => $this->bio,
            'bio_translate,'            => $this->bio_translate,
            'address'                   => $this->address,
            'address_translate,'        => $this->address_translate,
            'avatar'                    => $this->avatar,
            'cover_photo'               => $this->cover_photo,
            'website'                   => $this->website,
            'instagram'                 => $this->instagram,
            'facebook'                  => $this->facebook,
            'twitter'                   => $this->twitter,
            'status_name'               => DesignerStatusType::getType($this->status),

        ];
    }
}
