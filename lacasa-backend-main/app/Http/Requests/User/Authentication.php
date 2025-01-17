<?php

namespace App\Http\Requests\User;

use App\Enums\EmailBlocked;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Authentication extends FormRequest
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
            'email' => [
                'required',
                'email',
                Rule::notIn(EmailBlocked::getEmail())
            ],
            'password' => 'required|string',
        ];
    }
}
