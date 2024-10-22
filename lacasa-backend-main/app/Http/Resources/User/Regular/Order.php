<?php

namespace App\Http\Resources\User\Regular;

use App\Http\Resources\Order\PaymentMethod;
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
            'payment_method' => new PaymentMethod($this->payment_method),
            'address' => new Addressbook($this->address),
            'products' => OrderProduct::collection($this->products),
            // 'address' => $this->address,
            'status' => $this->status,
            'user' => $this->user->name,
            'total' => $this->total,
            'shipping_fees' => $this->shipping_fees,
            'subtotal' => $this->subtotal,
            'created_at' => $this->created_at,
        ];
    }
}
