<?php

namespace App\Http\Resources\User;

use App\Enums\DesignerStatusType;
use App\Http\Resources\User\Designer\Category;
use App\Http\Resources\User\Designer\Project;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use App\Enums\ProfessionalCategoryType;
use Spatie\Permission\Models\Permission;

class DesignerUser extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'experience' => $this->designer->experience,
//            'type'                      => ProfessionalCategoryType::getProfessionalCategoryType($this->designer->type),
            'type' => (int)$this->designer->type,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company_name' => $this->designer->company_name,
            'company_name_translate' => $this->designer->company_name_translate,
            'job_title' => $this->designer->job_title,
            'job_title_translate' => $this->designer->job_title_translate,
            'bio' => $this->designer->bio,
            'bio_translate' => $this->designer->bio_translate,
            'address' => $this->designer->address,
            'address_translate' => $this->designer->address_translate,
            'avatar' => $this->designer->avatar,
            'cover_photo' => $this->designer->cover_photo,
            'website' => $this->designer->website,
            'instagram' => $this->designer->instagram,
            'facebook' => $this->designer->facebook,
            'twitter' => $this->designer->twitter,
            'area' => $this->designer->area ? [
                'id' => $this->designer->area_id,
                'name' => $this->designer->area->name,
                'city' => [
                    'id' => $this->designer->area->city->id,
                    'name' => $this->designer->area->city->name,
                ],
            ] : null,
            'permissions' => $this->hasRole('Super Admin') ? Permission::pluck('name') : $this->getPermissionNames(),
            'addressbook' => [
                'shipping' => Addressbook::collection($this->shipping_address),
                'billing' => Addressbook::collection($this->billing_address),
            ],
            'projects' => Project::collection($this->designer->projects),
            'categories' => Category::collection($this->designer->categories),
            'attachments' => AttachmentResource::collection($this->designer->images),
            'status' => $this->designer->status,
            'status_name' => DesignerStatusType::getType($this->designer->status),
        ];
    }
}
