<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class OrangeVoucher extends JsonResource
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
            'voucher' => $this->voucher,
            'value' => $this->value,
            'is_redeemed' => $this->is_redeemed,
            'mobile' => $this->mobile,
            'transaction_id' => $this->transaction_id,
            'created_at' => $this->created_at,
        ];
    }
}
