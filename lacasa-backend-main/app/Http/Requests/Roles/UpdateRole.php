<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRole extends FormRequest
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
            // 'name' => 'nullable|string|unique:roles,name,'.$this->id.',id',
            // 'name' => Rule::unique('roles')->ignore($this->request->get('id')),
            'attach-permissions' => 'nullable|array',
            'attach-permissions.*' => 'nullable|exists:permissions,id',
            'detach-permissions' => 'nullable|array',
            'detach-permissions.*' => 'nullable|exists:permissions,id',
            'attach-users' => 'nullable|array',
            'attach-users.*' => 'nullable|exists:users,id',
            'detach-users' => 'nullable|array',
            'detach-users.*' => 'nullable|exists:users,id',
        ];
    }
}
