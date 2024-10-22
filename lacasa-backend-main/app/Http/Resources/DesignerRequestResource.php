<?php

namespace App\Http\Resources;

use App\Enums\DesiredServiceEnum;
use App\Enums\ProjectSectorEnum;
use App\Enums\RequestStatustypeEnum;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignerRequestResource extends JsonResource
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
            'id'                     => $this->id,
            'user_id'                => $this->user_id,
            'user'                   => $this->user?->name??'',
            'designer_id'            => $this->designer_id,
            'designer'               => $this->designer->user?$this->designer->user->name:null,
            'project_scope'          => $this->projectsScope ? DesignerRequestProjectResource::collection($this->projectsScope) : null,
            'project_sector'         => ProjectSectorEnum::getProjectSector($this->project_sector),
            'project_location'       => $this->project_location,
            'project_area'           => $this->project_area,
            'project_descreption'    => $this->project_descreption,
            'desired_service'        => DesiredServiceEnum::getDesiredService($this->desired_service),
            'drawings'               => $this->drawings??null,
            'inspirations'           => $this->inspirations??null,
            'style_descreption'      => $this->style_descreption,
            'name'                   => $this->name,
            'email'                  => $this->email,
            'phone'                  => $this->phone,
            'phone_communication'    => $this->phone_communication,
            'email_communication'    => $this->email_communication,
            'whatsapp_communication' => $this->whatsapp_communication,
            'f_10_to_5_am'           => $this->f_10_to_5_am,
            'f_5_to_10_am'           => $this->f_5_to_10_am,
            'f_10_to_5_pm'           => $this->f_10_to_5_pm,
            'f_5_to_10_pm'           => $this->f_5_to_10_pm,
            'status_id'              => $this->status ? $this->status :RequestStatustypeEnum::Pending,
            'status'                 => $this->status ? RequestStatustypeEnum::getType($this->status) : RequestStatustypeEnum::getType(RequestStatustypeEnum::Pending),
        ];
    }
}
