<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use Spatie\Permission\Models\Permission;

class VendorUser extends JsonResource
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
            'permissions' => $this->hasRole('Super Admin') ? Permission::pluck('name') : $this->getPermissionNames(),
            'addressbook' => [
                'shipping' => Addressbook::collection($this->shipping_address),
                'billing' => Addressbook::collection($this->billing_address),
            ],
            'vendor' => [
                'id' => $this->vendor->id,
                'name' => $this->vendor->company_name,
                'email' => $this->vendor->email,
                'logo' => $this->vendor->logo,
                'address' => $this->vendor->street_address,
                'city' => $this->vendor->city->name,
                'area' => $this->vendor->area?->name,
                'status' => $this->vendor->status,
                'commission' => $this->vendor->commission,
                'products_count' => $this->products->count(),
                'sold_products' => $this->soldProductsCount(),
                'account_manager' => [
                    'id' => $this->vendor->account_manager?->id,
                    'name' => $this->vendor->account_manager?->name,
                    'phone' => $this->vendor->account_manager?->phone,
                    'email' => $this->vendor->account_manager?->email,
                ],
                'bank_details' => [
                    'bank_name' => $this->vendor->bank_name,
                    'bank_account_owner_name' => $this->vendor->bank_account_owner_name,
                    'account_number' => $this->vendor->account_number,
                    'iban' => $this->vendor->iban,
                    'swift_code' => $this->vendor->swift_code,
                ],
                'owner_details' => [
                    'name' => $this->vendor->owner_name,
                    'phone' => $this->vendor->owner_phone,
                ],
                'attachments' => AttachmentResource::collection($this->vendor->images),
            ],

        ];
    }
}
