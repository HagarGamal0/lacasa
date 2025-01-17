<?php

namespace App\Http\Requests\DynamicData\HomeSlider;

use Illuminate\Foundation\Http\FormRequest;

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
            'title' => 'string|required',
            'description' => 'string|required',
            'link' => 'string|required',
            'image' => 'file|required',
            'mobile_image' => 'file|required',
            // 'order' => 'integer|required',
        ];
    }
}
