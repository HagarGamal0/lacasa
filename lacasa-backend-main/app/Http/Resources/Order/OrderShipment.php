<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrderShipment extends JsonResource
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
            'provider' => $this->shipping_provider->name,
            'airway_bill' => $this->airway_bill,
            'pickup_date' => $this->pickup_date,
            'shipping_label' => $this->shipping_label,
            'items' => OrderItem::collection($this->items),
        ];
    }
}
