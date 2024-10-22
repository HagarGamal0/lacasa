<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrder extends FormRequest
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
            // require address info if no address_id found
            'address' => 'required_without:address_id',
            'address.id' => 'integer|required_without:address|exists:address_books,id',
            'address.first_name' => 'required_without:address.id|string',
            'address.last_name' => 'required_without:address.id|string',
            'address.phone' => 'required_without:address.id|digits:11',
            'address.email' => 'required_without:address.id|email:rfc,dns',
            // 'address.address' => 'required_without:address.id|string',
            'address.area_id' => 'required_without:address.id|exists:areas,id',
            'address.type' => 'required_without:address.id|in:shipping,billing',
            'address.default' => 'required_without:address.id|boolean',
            'address.street' => 'required_without:address.id|string',
            'address.apartment_no' => 'required_without:address.id|string',
            'address.building_no' => 'required_without:address.id|string',
            'address.floor_no' => 'required_without:address.id|string',
            // order info
            'payment_method' => 'integer|required|exists:payment_methods,id',
            'wallet_number' => [
                'required_if:payment_method,' . \DB::table('payment_methods')->where('name', 'wallet')->value('id'),
                'digits:11',
            ],
            'coupon' => 'nullable|exists:coupons,coupon_code',
            'voucher_id' => 'nullable|exists:orange_vouchers,id',
            'notes' => 'string|nullable',
        ];
    }
}
