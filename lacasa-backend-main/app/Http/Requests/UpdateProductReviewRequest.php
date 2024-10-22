<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductReviewRequest extends FormRequest
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
            'title' => 'required|string',
            'description' => 'required|string',
            'stars' => 'required|integer|min:1|max:5',
        ];
    }

    public function messages()
    {
        return [
            'title.required'                => __('validation.required',['attribute'=>__('lang.title')]) ,
            'title.string'                  => __('validation.string',['attribute'=>__('lang.title')]) ,
            'description.required'          => __('validation.required',['attribute'=>__('lang.description')]) ,
            'description.string'            => __('validation.string',['attribute'=>__('lang.description')]) ,
            'stars.required'                => __('validation.required',['attribute'=>__('lang.stars')]) ,
            'stars.integer'                 => __('validation.integer',['attribute'=>__('lang.stars')]) ,
            'stars.min'                     => __('validation.min.numeric',['attribute'=>__('lang.stars'),'min'=>'1']) ,
            'stars.max'                     => __('validation.max.numeric',['attribute'=>__('lang.stars'),'max'=>'5']) ,
        ];
    }
}
