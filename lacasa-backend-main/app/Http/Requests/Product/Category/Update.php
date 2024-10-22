<?php

namespace App\Http\Requests\Product\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use function App\Http\Helpers\getLanguages;

class Update extends FormRequest
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
        $rules=[
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|file|mimes:png,jpg,svg',
            'show_in_menu' => ['required']
        ];

        $langs = getLanguages();

        foreach ($langs as $lang) {
            $rules['name.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:100',
                // Rule::unique('category_translations', 'name')
                //     ->where('locale', $lang['locale'])
                //     ->whereNot('category_id', $this->category->id)
            ];
            $rules['banner.' . $lang['locale']] = ['nullable', 'file', 'mimes:png,jpg,svg'];
        }

        return $rules;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'show_in_menu' => $this->boolean('show_in_menu'),
        ]);
    }
}
