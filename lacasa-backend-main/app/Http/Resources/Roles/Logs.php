<?php

namespace App\Http\Resources\Roles;

use Illuminate\Http\Resources\Json\JsonResource;

class Logs extends JsonResource
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
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'causer' => $this->causer ? [
                'id' => $this->causer->id,
                'name' => $this->causer->name,
                'email' => $this->causer->email,
                'phone' => $this->causer->phone,
                'roles' => $this->causer->roles->pluck('name'),
            ] : null,
            'event' => $this->event,
            'subject' => [
                'type' => substr($this->subject_type, strrpos($this->subject_type, '\\') + 1),
                'id' => $this->subject->id,
                'slug' => $this->subject->slug,
                'properties' => $this->properties,
            ],
            'date' => $this->updated_at,
        ];
    }
}
