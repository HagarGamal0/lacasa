<?php

namespace App\Http\Requests\DynamicData;

use Illuminate\Foundation\Http\FormRequest;

class CreateCountBanner extends FormRequest
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
            'title' => 'string|required',
            'link_title' => 'string|required',
            'start_date' => 'date|required',
            'expire_date' => 'date|required',
            'link' => 'string|required',
            'image_url' => 'file|required',
            'color' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ];
    }
}
