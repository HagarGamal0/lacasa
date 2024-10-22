<?php

namespace App\Http\Requests\User\Designer\Category;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ProfessionalCategoryType;
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
        $rules = [
            'parent_id' => 'nullable|exists:categories,id',
            'type'      => ['required',Rule::in([ProfessionalCategoryType::Designer,ProfessionalCategoryType::Supplier])]
        ];

        $langs = getLanguages();

        foreach ($langs as $lang) {
            $rules['name.' . $lang['locale']] = ['required', 'string', 'min:2', 'max:100',
                Rule::unique('designer_category_translations', 'name')
                    ->where('locale', $lang['locale'])
                    ->whereNot('designer_category_id', $this->category)
            ];
            $rules['description.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:100'];
            $rules['image.' . $lang['locale']] = ['nullable', 'file', 'mimes:png,jpg,svg'];
        }


        return $rules;
    }
}
