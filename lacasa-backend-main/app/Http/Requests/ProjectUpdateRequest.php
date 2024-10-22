<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectUpdateRequest extends FormRequest
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
        $rules = [
                    'title'       => 'required|string',
                    'description' => 'required|string',
                    'images'      => 'array|required',
                ];

        return $rules;
    }

    public function messages()
    {
        $messages = [
            'title.required'                 => __('validation.required',['attribute'=>__('lang.title')]) ,
            'title.string'                   => __('validation.string',['attribute'=>__('lang.title')]) ,
            'description.required'           => __('validation.required',['attribute'=>__('lang.description')]) ,
            'description.string'             => __('validation.string',['attribute'=>__('lang.description')]) ,
            'images.array'                   => __('validation.array',['attribute'=>__('lang.images')]) ,
            'images.required'                => __('validation.required',['attribute'=>__('lang.images')]) ,
            'images.*'                       => __('validation.file',['attribute'=>__('lang.image')]) ,
        ];
        return $messages;
    }
}
