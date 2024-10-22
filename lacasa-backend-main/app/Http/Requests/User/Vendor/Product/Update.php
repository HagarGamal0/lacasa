<?php

namespace App\Http\Requests\User\Vendor\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use function App\Http\Helpers\getLanguages;

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
        // dd($this->product);

        $rules = [

            'price' => 'integer|nullable',
            'stock' => 'integer|nullable',
            'discount' => 'numeric|nullable',
            'discount_type' => 'nullable|in:percentage,fixed',
            'featured' => 'nullable|boolean',
            'sku' => 'string|unique:products,sku,' . $this->product,
            'brand' => 'nullable|string',
            'status' => 'in:Published,Pending,Draft,Trash',
            'images' => 'nullable|array',
            'images.*' => 'nullable|max:800',
            'categories' => 'nullable|array',
            'categories.*' => 'nullable|integer|exists:categories,id',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'exists:images,id',
            'shipping_profile_id' => 'nullable|integer|exists:shipping_profiles,id',
            'attributes' => 'nullable|array',
            'attributes.*.name' => 'required_with:attributes|string',
            'attributes.*.values' => 'required_with:attributes.*.name|array',
            'attribute.*.values.*.title' => 'required_with:attributes.*.name|string',
            'attribute.*.values.*.price' => 'nullable|integer',
            'attribute.*.values.*.price_after_sale' => 'nullable|integer',
            'tags' => 'nullable|array',
            'order' => ['nullable', 'numeric'],
            'tags.*.name' => 'required_with:tags|string',
        ];


        $langs = getLanguages();

        foreach ($langs as $lang) {
            $rules['name.' . $lang['locale']] = ['nullable', 'string', 'min:2',
                // ,
                //     Rule::unique('product_translations', 'name')
                //         ->where('locale', $lang['locale'])
                //         ->whereNot('product_id', $this->product->id)
            ];
            $rules['description.' . $lang['locale']] = ['nullable', 'string'];
            $rules['short_description.' . $lang['locale']] = ['nullable', 'string'];
        }

        return $rules;
    }
}
