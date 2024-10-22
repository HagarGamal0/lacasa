<?php

namespace App\Http\Requests\User\Addressbook;

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
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'phone'      => 'required|digits:11',
            'email'      => 'required|email:rfc,dns',
            'area_id'    => 'required|exists:areas,id',
            'type'       => 'required|in:shipping,billing',
            'default'    => 'required|boolean',
            'street'     => 'required|string',
            'apartment_no' => 'required|string',
            'building_no'  => 'required|string',
            'floor_no'     => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'first_name.required' => __('validation.required',['attribute'=>__('lang.first_name')]) ,
            'first_name.string'   => __('validation.string',['attribute'=>__('lang.first_name')]) ,
            'last_name.required'  => __('validation.required',['attribute'=>__('lang.last_name')]) ,
            'last_name.string'    => __('validation.string',['attribute'=>__('lang.last_name')]) ,
            'phone.required'      => __('validation.required',['attribute'=>__('lang.phone')]),
            'phone.digits'        => __('validation.digits',['attribute'=>__('lang.phone') ,'digits' => 11]),
            'email.required'      => __('validation.required',['attribute'=>__('lang.email')]),
            'email.email'         => __('validation.email',['attribute'=>__('lang.email')]),
            'area_id.required'    => __('validation.required',['attribute'=>__('lang.area_id')]),
            'area_id.exists'      => __('validation.exists',['attribute'=>__('lang.area_id')]),
            'type.required'       => __('validation.required',['attribute'=>__('lang.type')]),
            'type.in'             => __('validation.required',['attribute'=>__('lang.type')]),
            'default.required'    => __('validation.required',['attribute'=>__('lang.default')]),
            'default.boolean'       => __('validation.boolean',['attribute'=>__('lang.default')]),
            'street.required'       => __('validation.required',['attribute'=>__('lang.street')]) ,
            'street.string'         => __('validation.string',['attribute'=>__('lang.street')]) ,
            'apartment_no.required' => __('validation.required',['attribute'=>__('lang.apartment_no')]) ,
            'apartment_no.string'   => __('validation.string',['attribute'=>__('lang.apartment_no')]) ,
            'building_no.required'  => __('validation.required',['attribute'=>__('lang.building_no')]) ,
            'building_no.string'    => __('validation.string',['attribute'=>__('lang.building_no')]) ,
            'floor_no.required'     => __('validation.required',['attribute'=>__('lang.floor_no')]) ,
            'floor_no.string'       => __('validation.string',['attribute'=>__('lang.floor_no')]) ,
        ];
    }
}
