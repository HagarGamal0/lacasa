<?php

namespace App\Http\Resources;

use App\Enums\ProjectScopeEnum;
use App\Models\User\Designer\DesignerRequestProject;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignerRequestProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'project_id' => $this->project_id,
            'project'    => ProjectScopeEnum::getProjectScope($this->project_id),
        ];
    }
}
