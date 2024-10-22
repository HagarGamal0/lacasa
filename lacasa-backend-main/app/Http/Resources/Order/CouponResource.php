<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Product\Product;
use App\Http\Resources\User\Vendor\Coupons as VendorCouponsResource;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class CouponResource extends JsonResource
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
            'coupon_code' => $this->coupon_code,
            'usage_type' => $this->usage_type,
            // 'no_of_usage' => $this->no_of_usage,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            // 'has_categories' => $this->has_categories,
            // 'has_vendors' => $this->has_vendors,
            // 'vendors' => VendorCouponsResource::collection($this->vendors),
            'start_date' => $this->start_date,
            'expiry' => $this->expiry,
            'used_count' => $this->used_count,
            'total_discounts' => $this->total_discounts,
            'status' => $this->status,
            'first_order' => $this->first_order,

            'usage_limit_per_user' => $this->usage_limit_per_user,
            'usage_limit' => $this->usage_limit,
            'min_purchase' => $this->min_purchase,
            'min_quantity' => $this->min_quantity,
            'allocation_method' => $this->allocation_method,
            'products' => Product::collection($this->whenLoaded('products')),
        ];
    }
}
