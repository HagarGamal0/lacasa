<?php

namespace App\Http\Requests\User\Regular;

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
            'email' => 'email:rfc,dns|unique:users',
            'phone' => 'digits:11',
            'password' => ['confirmed', Password::min(8)->uncompromised()],
        ];
    }

    public function messages()
    {
        return [
            'name.required'        => __('validation.required',['attribute'=>__('lang.name')]) ,
            'name.string'          => __('validation.string',['attribute'=>__('lang.name')]) ,
            'email.required'       => __('validation.required',['attribute'=>__('lang.email')]) ,
            'email.email'          => __('validation.email',['attribute'=>__('lang.email')]) ,
            'email.unique'         => __('validation.unique',['attribute'=>__('lang.email')]) ,
            'phone.required'       => __('validation.required',['attribute'=>__('lang.phone')]),
            'phone.digits'         => __('validation.digits',['attribute'=>__('lang.phone') ,'digits' => 11]),
            'password.required'    => __('validation.required',['attribute'=>__('lang.password')]) ,
            'password.confirmed'   => __('validation.confirmed',['attribute'=>__('lang.password')]) ,
        ];
    }
}
