<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use DB;
class CalculateOrderRequest extends FormRequest
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
                'address' => 'required|array',
                'address.id' => 'integer|required_without:address|exists:address_books,id',
                'address.first_name' => 'required_without:address.id|string',
                'address.last_name' => 'required_without:address.id|string',
                'address.phone' => 'required_without:address.id|digits:11',
                'address.email' => 'required_without:address.id|email:rfc,dns',
                // 'address.address' => 'required_without:address.id|string',
                'address.area_id' => 'required_without:address.id|exists:areas,id',
                'address.type'    => 'required_without:address.id|in:shipping,billing',
                'address.default' => 'required_without:address.id|boolean',
                'address.street' => 'required_without:address.id|string',
                'address.apartment_no' => 'required_without:address.id|string',
                'address.building_no' => 'required_without:address.id|string',
                'address.floor_no' => 'required_without:address.id|string',
                // order info
                'payment_method' => 'integer|required|exists:payment_methods,id',
                'wallet_number' => [
                    'required_if:payment_method,' . DB::table('payment_methods')->where('name', 'wallet')->value('id'),
                    'digits:11',
                ],
                // discounts
                'coupon' => 'nullable|exists:coupons,coupon_code',
                'voucher_id' => 'nullable|exists:orange_vouchers,id',
                'notes' => 'string|nullable',
        ];
    }

    public function messages()
    {
        return [
            'address.required'             => __('validation.required',['attribute'=>__('lang.address.address')]) ,

            'address.id.integer'           => __('validation.integer',['attribute'=>__('lang.address.id')]) ,
            'address.id.required_without'  => __('validation.required_without',['attribute'=>__('lang.address.id'),'values' =>__('lang.address.address')]) ,
            'address.id.exists'            => __('validation.exists',['attribute'=>__('lang.address.id')]) ,
            
            'address.first_name.string'           => __('validation.integer',['attribute'=>__('lang.address.first_name')]) ,
            'address.first_name.required_without'  => __('validation.required_without',['attribute'=>__('lang.address.first_name'),'values' =>__('lang.address.address')]) ,
            
            'address.last_name.string'           => __('validation.integer',['attribute'=>__('lang.last_name')]) ,
            'address.last_name.required_without'  => __('validation.required_without',['attribute'=>__('lang.last_name'),'values' =>__('lang.address.address')]) ,
         
            'address.phone.string'            => __('validation.digits',['attribute'=>__('lang.phone'),'digits'=>11]) ,
            'address.phone.required_without'  => __('validation.required_without',['attribute'=>__('lang.phone'),'values' =>__('lang.address.address')]) ,

            'address.email.email'            => __('validation.email',['attribute'=>__('lang.email')]) ,
            'address.email.required_without'  => __('validation.required_without',['attribute'=>__('lang.email'),'values' =>__('lang.address.address')]) ,

            'address.area_id.exists'            => __('validation.exists',['attribute'=>__('lang.area_id')]) ,
            'address.area_id.required_without'  => __('validation.required_without',['attribute'=>__('lang.area_id'),'values' =>__('lang.address.address')]) ,

            'address.type.exists'            => __('validation.in',['attribute'=>__('lang.type')]) ,
            'address.type.required_without'  => __('validation.required_without',['attribute'=>__('lang.type'),'values' =>__('lang.address.address')]) ,
            
            'address.default.boolean'            => __('validation.boolean',['attribute'=>__('lang.default')]) ,
            'address.default.required_without'  => __('validation.required_without',['attribute'=>__('lang.default'),'values' =>__('lang.address.address')]) ,
            
            'address.street.string'            => __('validation.string',['attribute'=>__('lang.street')]) ,
            'address.street.required_without'  => __('validation.required_without',['attribute'=>__('lang.street'),'values' =>__('lang.address.address')]) ,

            'address.apartment_no.string'            => __('validation.string',['attribute'=>__('lang.apartment_no')]) ,
            'address.apartment_no.required_without'  => __('validation.required_without',['attribute'=>__('lang.apartment_no'),'values' =>__('lang.address.address')]) ,

            'address.building_no.string'            => __('validation.string',['attribute'=>__('lang.building_no')]) ,
            'address.building_no.required_without'  => __('validation.required_without',['attribute'=>__('lang.building_no'),'values' =>__('lang.address.address')]) ,

            'address.floor_no.string'               => __('validation.string',['attribute'=>__('lang.floor_no')]) ,
            'address.floor_no.required_without'     => __('validation.required_without',['attribute'=>__('lang.floor_no'),'values' =>__('lang.address.address')]) ,

            'payment_method.integer'                => __('validation.integer',['attribute'=>__('lang.payment_method')]) ,
            'payment_method.required'               => __('validation.required',['attribute'=>__('lang.payment_method')]) ,
            'payment_method.exists'                 => __('validation.exists',['attribute'=>__('lang.payment_method')]) ,
            
            'wallet_number.required_if'             => __('validation.required_if',['attribute'=>__('lang.wallet_number') , 'other' =>__('lang.payment_method'),'value'=>'']) ,
            'wallet_number.digits'                  => __('validation.digits',['attribute'=>__('lang.wallet_number') , 'digits' =>__('lang.payment_method')]) ,
            
            
            'coupon.exists'                         => __('validation.exists',['attribute'=>__('lang.coupon')]) ,
            'voucher_id.exists'                     => __('validation.exists',['attribute'=>__('lang.voucher_id')]) ,
            'notes.string'                          => __('validation.string',['attribute'=>__('lang.notes')]) ,
            
        ];
    }
}
