<?php

namespace App\Http\Requests\FlashSale;

use App\Http\Requests\Shipping\ShippingProfile;
use App\Models\World\City;
use Illuminate\Foundation\Http\FormRequest;

class Create extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'campaign_name' => 'string|required',
            'expire_at' => 'date|required|after:today',
            'precentage_discount' => 'integer|max:100|min:0',
            'has_shipping_profile' => 'integer|in:0,1',
            // 'rules' => (new ShippingProfile)->rules()['rules'],

            'rules' => 'exclude_if:has_shipping_profile,0|array|size:' . City::count(),
            'rules.*.city_id' => 'required_with:rules|exists:cities,id|distinct',
            'rules.*.shipping_fee' => 'required_with:rules|integer',
            'rules.*.is_disabled' => 'required|boolean',
            'rules.*.estimated_delivery' => 'required_with:rules|string',

            'products' => 'nullable',
            'products.vendors' => 'nullable|array',
            'products.vendors.*' => 'required_with:products.vendors,exists:users,id',
            'products.categories' => 'nullable|array',
            'products.categories.*' => 'required_with:products.categories,exists:categories,id',
            'products.include' => 'nullable|array',
            'products.include.*' => 'required_with:products.include|exists:products,id',
            'products.exclude' => 'nullable|array',
            'products.exclud.*' => 'required_with:products.exclude|exists:products,id',
        ];
    }
}
