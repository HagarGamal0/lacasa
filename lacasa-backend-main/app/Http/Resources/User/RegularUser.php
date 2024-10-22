<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use Spatie\Permission\Models\Permission;

class RegularUser extends JsonResource
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
            'type' => $this->user_type,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'block' => $this->block,
            'permissions' => $this->hasRole('Super Admin') ? Permission::pluck('name') : $this->getAllPermissions()->pluck('name'),
            'addressbook' => [
                'shipping' => Addressbook::collection($this->shipping_address),
                'billing' => Addressbook::collection($this->billing_address),
            ],
            'created_at' => $this->created_at,
            'analytics' => [
                'orders_count' => $this->orders()
                ->where('status', '!=', 'Returned')
                ->where('status', '!=', 'Rejected')
                ->where('status', '!=', 'Refunded')
                ->where('status', '!=', 'Delivered failed')
                ->where('status', '!=', 'Cancelled')
                ->count(),
                // "total_purchases" => $this->orders()->with('carts')->where('status', 'Order')->sum('carts.total'),
            ],
        ];
    }
}
