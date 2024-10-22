<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class OTPVerificationRequest extends FormRequest
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
            'phone' => 'required|digits:11',
            'otp' => 'required|string|size:6'
        ];
    }

    public function messages()
    {
        return [
            'phone.required'       => __('validation.required', ['attribute' => __('lang.phone')]),
            'phone.digits'         => __('validation.digits', ['attribute' => __('lang.phone'), 'digits' => 11])
        ];
    }
}
