<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class ValidateCartItems extends FormRequest
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

            'products' => 'array|required',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.attributes' => 'nullable|array',
            'products.*.attributes.*' => 'required_with:products.*.attributes|exists:attribute_values,id|integer',
            'products.*.fabric_color' => 'nullable|integer',
        ];
    }
}
