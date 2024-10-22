<?php

namespace App\Http\Requests\Shipping;

use App\Models\World\City;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ShippingProfileType;
use Illuminate\Validation\Rule;

class ShippingProfile extends FormRequest
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
            'name' => 'required|string',
            'type'      => ['required',Rule::in([ShippingProfileType::Light,ShippingProfileType::Heavey])],
            'rules' => 'required|array|size:' . City::count(),
            'rules.*.city_id' => 'required|exists:cities,id|distinct',
            'rules.*.shipping_fee' => 'required|integer',
            'rules.*.is_disabled' => 'required|boolean',
            'rules.*.estimated_delivery' => 'required|string',
            'shipping_provider_id' => 'required|exists:shipping_providers,id',
            'products' => 'nullable',
            'products.vendors' => 'nullable|array',
            'products.vendors.*' => 'required_with:products.vendors|exists:users,id',
            'products.vendor_categories' => 'nullable|array',
            'products.vendor_categories.*.id' => 'required_with:products.vendor_categories,exists:users,id',
            'products.vendor_categories.*.categories' => 'required_with:products.vendor_categories|array',
            'products.vendor_categories.*.categories.*' => 'required_with:products.vendor_categories|exists:categories,id',
            'products.categories' => 'nullable|array',
            'products.categories.*' => 'required_with:products.categories|exists:categories,id',
            'products.include' => 'nullable|array',
            'products.include.*' => 'required_with:products.include|exists:products,id',
            'products.exclude' => 'nullable|array',
            'products.exclud.*' => 'required_with:products.exclude|exists:products,id',
        ];
    }
}
