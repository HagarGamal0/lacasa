<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWheelRequest extends FormRequest
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
            'name' => 'string|required',
            'color' => 'string|required',
            'value' => 'required|integer|min:1,max:100',
            'is_winable' => 'required|integer|in:0,1',
            'description' => 'string|nullable',
            'products' => 'required|min:1',
            'products.exclude_categories' => 'nullable|array',
            'products.exclude_categories.*' => 'required_without:products.categories|exists:categories,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required'      =>__('validation.required',['attribute'=>__('lang.name')]),
            'name.string'        =>__('validation.string',['attribute'=>__('lang.name')]),
            'color.required'     =>__('validation.required',['attribute'=>__('lang.color')]),
            'color.string'       =>__('validation.string',['attribute'=>__('lang.color')]),
            'value.required'     =>__('validation.required',['attribute'=>__('lang.value')]),
            'value.min'          =>__('validation.min.numeric',['attribute'=>__('lang.value',['min'=>1])]),
            'value.min'          =>__('validation.max.numeric',['attribute'=>__('lang.value',['min'=>100])]),
            'is_winable.required'=>__('validation.required',['attribute'=>__('lang.is_winable')]),
            'is_winable.integer' =>__('validation.integer',['attribute'=>__('lang.is_winable')]),
            'is_winable.in'      =>__('validation.in',['attribute'=>__('lang.is_winable')]),
            'description.string' =>__('validation.string',['attribute'=>__('lang.description')]),
            'products.required'  =>__('validation.required',['attribute'=>__('lang.products')]),
            'products.min'       =>__('validation.min',['attribute'=>__('lang.products',['min'=>1])]),
            'products.exclude_categories.array'       =>__('validation.array',['attribute'=>__('lang.exclude_categories')]),
            'products.exclude_categories.*.required_without'       =>__('validation.required_without',['attribute'=>__('lang.exclude_categories',['values'=>__('lang.exclude_categories')])]),
            'products.exclude_categories.*.exists'       =>__('validation.exists',['attribute'=>__('lang.exclude_categories')]),
        
        ];
        
    }
}
