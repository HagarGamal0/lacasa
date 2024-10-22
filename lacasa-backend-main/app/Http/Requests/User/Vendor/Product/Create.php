<?php

namespace App\Http\Requests\User\Vendor\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use function App\Http\Helpers\getLanguages;
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
     * @return array
     */
    public function rules()
    {
        $rules= [

            'price' => 'integer|required',
            'stock' => 'integer|required',
            'discount' => 'integer|required',
            'discount_type' => 'required|in:percentage,fixed',
            'featured' => 'required|boolean',
            'sku' => 'required|string|unique:products',
            'brand' => 'nullable|string',
            'shipping_profile_id' => 'integer|exists:shipping_profiles,id',
            'images' => 'required|array',
            'images.*' => 'required|mimes:png,jpg,svg|max:800',
            'categories' => 'required|array|',
            'categories.*' => 'required|integer|exists:categories,id',
            'attributes' => 'nullable|array',
            'attributes.*.name' => 'required_with:attributes|string',
            'attributes.*.values' => 'required_with:attributes.*.name|array',
            'attribute.*.values.*.title' => 'required_with:attributes.*.name|string',
            'attribute.*.values.*.price' => 'nullable|integer',
            'attribute.*.values.*.price_after_sale' => 'nullable|integer',
            'tags' => 'nullable|array',
            'tags.*.name' => 'required_with:tags|string',
            'vendor_id' => 'required|integer|exists:users,id',
            'order' => ['nullable', 'numeric'],

        ];

        $langs = getLanguages();

        foreach ($langs as $lang) {
            $rules['name.' . $lang['locale']] = ['required', 'string', 'min:2',
                Rule::unique('product_translations', 'name')
                    ->where('locale', $lang['locale'])
            ];
            $rules['description.' . $lang['locale']] = ['required', 'string'];
            $rules['short_description.' . $lang['locale']] = ['required', 'string'];
        }

        return $rules;
    }
}
