<?php

namespace App\Http\Requests\User\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDefaultShippingFee extends FormRequest
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
    }

    public function messages()
    {
        return [
            'is_bulk.required'             => __('validation.required',['attribute'=>__('lang.is_bulk')]) ,
            'is_bulk.boolean'              => __('validation.boolean',['attribute'=>__('lang.is_bulk')]) ,

            'categories.required'          => __('validation.required',['attribute'=>__('lang.categories')]) ,
            'categories.array'             => __('validation.array',['attribute'=>__('lang.categories')]) ,
            'categories.*.required'        => __('validation.required',['attribute'=>__('lang.category')]) ,
            'categories.*.integer'         => __('validation.integer',['attribute'=>__('lang.category')]) ,
            'categories.*.exists'          => __('validation.exists',['attribute'=>__('lang.category')]) ,

            'shipping.required'          => __('validation.required',['attribute'=>__('lang.shipping')]) ,
            'shipping.array'             => __('validation.array',['attribute'=>__('lang.shipping')]) ,

            'shipping.*.city_id.required'        => __('validation.required',['attribute'=>__('lang.city_id')]) ,
            'shipping.*.city_id.integer'         => __('validation.integer',['attribute'=>__('lang.city_id')]) ,
            'shipping.*.city_id.exists'          => __('validation.exists',['attribute'=>__('lang.city_id')]) ,
            
            'shipping.*.estimated_delivery.required'        => __('validation.required_if',['attribute'=>__('lang.estimated_delivery'),'other'=>'is_bulk','values'=>0]) ,
            'shipping.*.estimated_delivery.integer'         => __('validation.string',['attribute'=>__('lang.estimated_delivery')]) ,
            
            'shipping.*.is_disabled.required'        => __('validation.required_if',['attribute'=>__('lang.is_disabled'),'other'=>'is_bulk','values'=>0]) ,
            'shipping.*.is_disabled.integer'         => __('validation.boolean',['attribute'=>__('lang.is_disabled')]) ,
            'shipping.*.is_free.required'            => __('validation.required_if',['attribute'=>__('lang.is_free'),'other'=>'is_bulk','values'=>0]) ,
            'shipping.*.is_free.integer'             => __('validation.boolean',['attribute'=>__('lang.is_free')]) ,

        ];
    }
}
