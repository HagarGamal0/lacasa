<?php

namespace App\Http\Resources\User\Vendor;

use App\Http\Resources\Order\OrderItem;
use App\Http\Resources\User\Addressbook;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class Order extends JsonResource
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
            'status' => $this->status,
            'transaction_detail' => [
                'type' => $this->payment_method->display_name,
                'status' => $this->payment_status,
                'description' => $this->payment_status_description,
                'payment_id' => $this->payment_id,
            ],
            'payment_detail' => [
                'total' => $this->cart->items->sum('total'),
            ],
            'shipping_details' => [
                'shipping_address' => new Addressbook($this->address),
                'consignee' => [
                    'id' => $this->address->user->id,
                    'name' => $this->address->user->name,
                    'phone' => $this->address->user->phone,
                    'email' => $this->address->user->email,
                ],
            ],
            'notes' => $this->notes,
            'items' => OrderItem::collection($this->cart->items),
            'created_at' => $this->created_at,
        ];
    }
}
