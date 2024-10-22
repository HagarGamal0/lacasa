<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateCoupon extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'coupon_code' => 'required|string|unique:coupons',
            'allocation_method' => 'required|in:each,across',
            'usage_limit_per_user' => 'required|min:1|integer',
            'usage_limit' => 'required|min:1|integer',
            'min_quantity' => 'required|integer',
            'min_purchase' => 'required|integer',
            'max_purchase' => 'required|integer',
            'discount_type' => 'required|in:fixed,precentage',
            'discount_value' => 'required|integer',
            'max_discount' => 'required|integer',
            'products' => 'required|min:1',
            'products.exclude_categories' => 'nullable|array',
            'products.exclude_categories.*' => 'required_without:products.categories|exists:categories,id',
            'products.include' => 'nullable|array',
            'products.include.*' => 'required_with:products.include|exists:products,id',
            'expiry' => 'date_format:"Y-m-d"|required',
            'first_order' => 'in:0,1',
        ];
    }
}
