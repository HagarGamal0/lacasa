<?php

namespace App\Http\Requests\DynamicData;

use Illuminate\Foundation\Http\FormRequest;
use function App\Http\Helpers\getLanguages;
use Illuminate\Validation\Rule;
class UpdateItem extends FormRequest
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
        $rules= [
            'link' => 'required|string',
            'order' => 'nullable|integer',
        ];
        $langs = getLanguages();
        foreach ($langs as $lang) {
            $rules['title.' . $lang['locale']] = ['sometimes','required', 'string', 'min:2', 'max:200',
                // Rule::unique('static_item_translations', 'title')
                //     ->where('locale', $lang['locale'])
                //     ->whereNot('dynamic_item_id', $this->item)
            ];
            $rules['subtitle.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:200',
                // Rule::unique('static_item_translations', 'subtitle')
                //     ->where('locale', $lang['locale'])
                //     ->whereNot('dynamic_item_id', $this->item)
            ];
            $rules['description.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:255' ];
            $rules['image.' . $lang['locale']] = ['nullable', 'file', 'mimes:png,jpg,svg'];
            $rules['mobile_image.' . $lang['locale']] = ['nullable', 'file', 'mimes:png,jpg,svg'];
        }

        return $rules;
    }
}
