<?php

namespace App\Http\Requests\Product\ShippingFee;

use Illuminate\Foundation\Http\FormRequest;

class Update extends FormRequest
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
            'categories' => 'required|array',
            'categories.*' => 'required|integer|exists:categories,id',
            'shipping' => 'array|required',
            'shipping.city_id.*' => 'required|integer|exists:cities,id',
            'shipping.shipping_fees.*' => 'integer|required',
        ];
    }
}
