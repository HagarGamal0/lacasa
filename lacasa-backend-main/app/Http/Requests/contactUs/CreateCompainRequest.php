<?php

namespace App\Http\Requests\contactUs;

use Illuminate\Foundation\Http\FormRequest;

class CreateCompainRequest extends FormRequest
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
            'email' => 'email|required',
            'phone' => 'digits:11|required',
        ];
    }

    public function messages()
    {
        return [
            'first_name.required'     =>__('validation.required',['attribute'=>__('lang.first_name')]),
            'first_name.string'       =>__('validation.string',['attribute'=>__('lang.first_name')]),
            'last_name.required'      =>__('validation.required',['attribute'=>__('lang.last_name')]),
            'last_name.string'        =>__('validation.string',['attribute'=>__('lang.last_name')]),
            'email.required'          =>__('validation.required',['attribute'=>__('lang.email')]),
            'email.email'             =>__('validation.email',['attribute'=>__('lang.email')]),
            'phone.required'          => __('validation.required',['attribute'=>__('lang.phone')]),
            'phone.digits'            => __('validation.digits',['attribute'=>__('lang.phone') ,'digits' => 11]),
        ];
    }
}
