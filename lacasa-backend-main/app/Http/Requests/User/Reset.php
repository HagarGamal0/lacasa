<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class Reset extends FormRequest
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
             'email' => 'required_without:reset_token|email:rfc,dns|exists:users,email',
             'reset_token' => ['required_unless:password,null', 'exists:users,reset_token'],
             // Rule::exists('users', 'reset_token')->where('email', $this->email)],
             // 'password' => ['required_unless:reset_token,null', 'confirmed', Password::min(8)->uncompromised()],
             'password' => ['required_with:reset_token', 'confirmed', Password::min(8)->uncompromised()],
         ];
     }

     public function messages()
     {
         return [
             'email.exists' => 'The entered email is not registered.',
             'reset_token.exists' => 'Password recovery link is either invalid or expired.',
             'reset_token.required_unless' => 'The reset code is required to perform this action.',
         ];
     }
}
