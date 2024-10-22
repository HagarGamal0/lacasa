<?php

namespace App\Http\Requests\User\Vendor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

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
        return [
            'name' => 'string',
            'email' => 'email:rfc,dns|nullable',
            'phone' => 'digits:11',
            'password' => ['confirmed', Password::min(8)->uncompromised()],
            'vendor.company_name' => 'string',
            'vendor.email' => 'email:rfc,dns|nullable',
            'vendor.street_address' => 'string',
            'vendor.city_id' => 'exists:cities,id',
            'vendor.area_id' => 'exists:areas,id',
            'vendor.logo' => 'file|image|mimes:webp,gif,jpg,png,jpeg|max:1000',
            'vendor.commission' => 'nullable|integer',
            'vendor.status' => 'in:Pending,Active,Draft,Suspend,Trash',
            'vendor.bank_name' => 'string',
            'vendor.bank_account_owner_name' => 'string',
            'vendor.account_manager_id' => 'string|exists:users,id',
            'vendor.account_number' => 'string',
            'vendor.owner_name' => 'string',
            'vendor.owner_phone' => 'string',
            'vendor.iban' => 'string|iban',
            'vendor.swift_code' => 'string|bic',
            'vendor.seller_identity' => 'array',
            'vendor.commerical_registeration' => 'array',
            'vendor.tax_id' => 'array',
            'vendor.vat' => 'array',
            'vendor.rental_document' => 'array',
            'vendor.national_id' => 'array',
            'vendor.account_manager_id' => 'required|integer|exists:users,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required'                => __('validation.required',['attribute'=>__('lang.name')]) ,
            'name.string'                  => __('validation.string',['attribute'=>__('lang.name')]) ,
            'email.required'               => __('validation.required',['attribute'=>__('lang.email')]) ,
            'email.email'                  => __('validation.email',['attribute'=>__('lang.email')]) ,
            'email.unique'                 => __('validation.unique',['attribute'=>__('lang.email')]) ,
            'phone.required'               => __('validation.required',['attribute'=>__('lang.phone')]),
            'phone.digits'                 => __('validation.digits',['attribute'=>__('lang.phone') ,'digits' => 11]),
            'password.required'            => __('validation.required',['attribute'=>__('lang.password')]) ,
            'password.confirmed'           => __('validation.confirmed',['attribute'=>__('lang.password')]) ,
            'vendor.company_name.string'   => __('validation.string',['attribute'=>__('lang.vendor.company_name')]) ,
            'vendor.email.email'           => __('validation.email',['attribute'=>__('lang.vendor.email')]) ,
            'vendor.email.unique'          => __('validation.unique',['attribute'=>__('lang.vendor.email')]) ,
            'vendor.street_address.string' => __('validation.string',['attribute'=>__('lang.street_address')]) ,
            'vendor.city_id.string'        => __('validation.exists',['attribute'=>__('lang.city_id')]) ,
            'vendor.area_id.string'        => __('validation.exists',['attribute'=>__('lang.area_id')]) ,
            'vendor.logo.file'             => __('validation.file',['attribute'=>__('lang.logo')]) ,
            'vendor.logo.image'            => __('validation.image',['attribute'=>__('lang.logo')]) ,
            'vendor.logo.mimes'            => __('validation.mimes',['attribute'=>__('lang.logo')]) ,
            'vendor.logo.max'              => __('validation.max',['attribute'=>__('lang.logo')]) ,
            'vendor.commission.integer'    => __('validation.integer',['attribute'=>__('lang.vendor.commission')]) ,
            'vendor.status.in'             => __('validation.in',['attribute'=>__('lang.status')]) ,
            'vendor.bank_name.string'      => __('validation.string',['attribute'=>__('lang.vendor.bank_name')]) ,
            'vendor.bank_account_owner_name.string'      => __('validation.string',['attribute'=>__('lang.vendor.bank_account_owner_name')]) ,
            'vendor.account_number.string'               => __('validation.string',['attribute'=>__('lang.vendor.account_number')]) ,
            'vendor.owner_name.string'                   => __('validation.string',['attribute'=>__('lang.vendor.owner_name')]) ,
            'vendor.owner_phone.string'                  => __('validation.string',['attribute'=>__('lang.vendor.owner_phone')]) ,
            'vendor.iban.string'                         => __('validation.string',['attribute'=>__('lang.vendor.iban')]) ,
            'vendor.iban.iban'                           => __('validation.iban',['attribute'=>__('lang.vendor.iban')]) ,
            'vendor.swift_code.string'                   => __('validation.string',['attribute'=>__('lang.vendor.swift_code')]) ,
            'vendor.swift_code.bic'                      => __('validation.bic',['attribute'=>__('lang.vendor.swift_code')]) ,
            'vendor.seller_identity.array'               => __('validation.array',['attribute'=>__('lang.vendor.seller_identity')]) ,
            'vendor.commerical_registeration.array'      => __('validation.array',['attribute'=>__('lang.vendor.commerical_registeration')]) ,
            'vendor.tax_id.array'                        => __('validation.array',['attribute'=>__('lang.vendor.tax_id')]) ,
            'vendor.vat.array'                           => __('validation.array',['attribute'=>__('lang.vendor.vat')]) ,
            'vendor.rental_document.array'               => __('validation.array',['attribute'=>__('lang.vendor.rental_document')]) ,
            'vendor.national_id.array'                   => __('validation.array',['attribute'=>__('lang.vendor.national_id')]) ,
            'vendor.account_manager_id.required'         => __('validation.required',['attribute'=>__('lang.vendor.account_manager_id')]) ,
            'vendor.account_manager_id.integer'          => __('validation.integer',['attribute'=>__('lang.vendor.account_manager_id')]) ,
            'vendor.account_manager_id.exists'           => __('validation.exists',['attribute'=>__('lang.vendor.account_manager_id')]) ,

        ];
    }
}
