<?php

namespace App\Http\Requests\User\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingFee extends FormRequest
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
            'is_bulk' => 'required|boolean',
            'categories' => 'required|array',
            'categories.*' => 'required|integer|exists:categories,id',
            'shipping' => 'array|required',
            'shipping.*.city_id' => 'required|integer|exists:cities,id',
            'shipping.*.shipping_fees' => 'integer|required_if:is_bulk,0',
            'shipping.*.estimated_delivery' => 'string|required_if:is_bulk,0',
            'shipping.*.is_disabled' => 'required_if:is_bulk,0|boolean',
            'shipping.*.is_free' => 'required_if:is_bulk,0|boolean',
        ];
        // return [
        //     'shipping' => 'array|required',
        //     // 'shipping.city_id' => 'array|required',
        //     'shipping.city_id.*' => 'required|integer|exists:cities,id',
        //     // 'shipping.category_id' => 'array|required',
        //     'shipping.category_id.*' => 'required|integer|exists:categories,id',
        //     // 'shipping.shipping_fees.*' => 'array|required',
        //     'shipping.shipping_fees' => 'integer|required',
        // ];
    }
}
