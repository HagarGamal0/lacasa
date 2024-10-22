<?php

namespace App\Http\Requests\User;

use App\Http\Requests\User\Designer\Update as UpdateDesigner;
use App\Http\Requests\User\Regular\Update as UpdateRegular;
use App\Http\Requests\User\Vendor\Update as UpdateVendor;
use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateProfile extends FormRequest
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
        if (Auth::user()->is_vendor()) {
            return (new UpdateVendor)->rules();
        } elseif (Auth::user()->is_designer()) {
            return (new UpdateDesigner)->rules();
        } else {
            return (new UpdateRegular)->rules();
        }
    }

    public function messages()
    {
        if (Auth::user()->is_vendor()) {
            return (new UpdateVendor)->messages();
        } elseif (Auth::user()->is_designer()) {
            return (new UpdateDesigner)->messages();
        } else {
            return (new UpdateRegular)->messages();
        }
    }


  
}
