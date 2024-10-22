<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCart extends FormRequest
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
            'address' => 'required_without:address_id',
            'address.first_name' => 'required_without:address_id|string',
            'address.last_name' => 'required_without:address_id|string',
            'address.phone' => 'required_without:address_id|digits:11',
            'address.email' => 'required_without:address_id|email:rfc,dns',
            'address.address' => 'required_without:address_id|string',
            'address.area_id' => 'required_without:address_id|exists:areas,id',
            'address.type' => 'required_without:address_id|in:shipping,billing',
            'address.default' => 'required_without:address_id|boolean',
            'address.street' => 'required_without:address_id|string',
            'address.apartment_no' => 'required_without:address_id|string',
            'address.building_no' => 'required_without:address_id|string',
            'address.floor_no' => 'required_without:address_id|string',

            'address_id' => 'integer|required_without:address|exists:address_books,id',
            'payment_method' => 'nullable|integer|exists:payment_methods,id',
            'products' => 'array|required',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.attributes' => 'nullable|array',
            'products.*.attributes.*' => 'required_with:products.*.attributes|exists:attribute_values,id|integer',
            'products.*.fabric_color' => 'nullable|integer',
            'coupon' => 'nullable|exists:coupons,coupon_code',
            'voucher_id' => 'nullable|exists:orange_vouchers,id',
        ];
    }
}
