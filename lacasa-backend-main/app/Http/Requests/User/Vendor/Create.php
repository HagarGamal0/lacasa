<?php

namespace App\Http\Requests\User\Vendor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

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
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'required|digits:11',
            'password' => ['required', 'confirmed', Password::min(8)->uncompromised()],
            'vendor.company_name' => 'required|string',
            'vendor.email' => 'required|email|unique:vendors,email',
            'vendor.street_address' => 'required|string',
            'vendor.city_id' => 'required|exists:cities,id',
            'vendor.area_id' => 'required|exists:areas,id',
            'vendor.logo' => 'required|file|image|mimes:gif,jpg,png,jpeg|max:1000',
            'vendor.commission' => 'nullable|integer',
        ];
    }
}
