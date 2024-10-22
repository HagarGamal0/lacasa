<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Resources\Json\JsonResource;

class SalesSheetResource extends JsonResource
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
            'order_id' => $this->order_id,
            'batch_id' => $this->sheet_entry->id,
            'order_date' => $this->sheet_entry->order_date->format('Y-m-d'),
            'customer_name' => $this->sheet_entry->customer_name,
            'payment_method' => $this->sheet_entry->payment_method,
            'status' => $this->sheet_entry->status,
            'vendor_name' => $this->vendor_name,
            'net' => $this->net,
            'commission' => $this->commission
        ];
    }
}
