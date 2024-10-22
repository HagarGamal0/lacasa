<?php

namespace App\Http\Requests\Product\FlashSale;

use Illuminate\Foundation\Http\FormRequest;

class CreateFlashSale extends FormRequest
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
            'products.*.id' => 'integer|exists:products,id|required',
            'price_after_sale' => 'integer|required',
            'is_free_shipping' => 'boolean|required',
            'expire_at' => 'date|required',
        ];
    }
}
