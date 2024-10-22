<?php

namespace App\Http\Requests\User\Designer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use App\Enums\ProfessionalCategoryType;
use App\Models\User\User;
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
    public function rules(): array
    {
        $rules= [
            'email'        => ['required','email:rfc,dns',Rule::unique('users')->ignore($this->route('designer'))],
            'name'         => 'required|string',
            'phone'        => 'required|digits:11',
            'password'     => ['nullable', 'confirmed', Password::min(8)->uncompromised()],
            'type'         => ['required',Rule::in([ProfessionalCategoryType::Designer,ProfessionalCategoryType::Supplier])],
            'website'      => 'nullable|active_url',
            'avatar'       => 'nullable|file|image',
            'cover_photo'  => 'nullable|file|image',
            'twitter'      => 'nullable|active_url|starts_with:https://twitter.com/',
            'facebook'     => 'nullable|active_url|starts_with:https://facebook.com/,https://fb.com/',
            'instagram'    => 'nullable|active_url|starts_with:https://instagram.com/',
            'categories'   => 'array',
            'categories.*' => 'exists:designer_categories,id',
            'experience'   => 'nullable|integer',
            'price_range'  => 'nullable|string',
            'area_id'      => 'nullable|integer|exists:areas,id',
            'designer_identity' => 'nullable|file|image',
            'commerical_registeration' => 'nullable|file|image',
            'tax_id'       => 'nullable|image',
        ];
        $designerId = User::find($this->designer)->designer->id;
        $langs = getLanguages();
        foreach ($langs as $lang) {
            $rules['company_name.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:100',
                Rule::unique('designer_translations', 'company_name')
                    ->where('locale', $lang['locale'])
                    ->whereNot('designer_id', $designerId)
            ];
            $rules['job_title.' . $lang['locale']] = ['nullable', 'string', 'min:2', 'max:100'];
            $rules['bio.' . $lang['locale']] = ['nullable', 'string'];
            $rules['address.' . $lang['locale']] = ['nullable', 'string'];
        }
        return $rules;
    }

    public function messages(): array
    {
        $messages = [
            'name.required'                => __('validation.required',['attribute'=>__('lang.name')]) ,
            'name.string'                  => __('validation.string',['attribute'=>__('lang.name')]) ,
            'phone.required'               => __('validation.required',['attribute'=>__('lang.phone')]),
            'phone.digits'                 => __('validation.digits',['attribute'=>__('lang.phone') ,'digits' => 11]),
            'password.required'            => __('validation.required',['attribute'=>__('lang.password')]) ,
            'password.confirmed'           => __('validation.confirmed',['attribute'=>__('lang.password')]) ,
            'type.required'                => __('validation.required',['attribute'=>__('lang.type')]) ,
            'type.in'                      => __('validation.in',['attribute'=>__('lang.type')]) ,
            'website.active_url'           => __('validation.active_url',['attribute'=>__('lang.website')]) ,
            'avatar.file'                  => __('validation.file',['attribute'=>__('lang.avatar')]) ,
            'avatar.image'                 => __('validation.image',['attribute'=>__('lang.avatar')]) ,
            'avatar.mimes'                 => __('validation.mimes',['attribute'=>__('lang.avatar')]) ,
            'avatar.max'                   => __('validation.max',['attribute'=>__('lang.avatar')]) ,
            'cover_photo.file'             => __('validation.file',['attribute'=>__('lang.cover_photo')]) ,
            'cover_photo.image'            => __('validation.image',['attribute'=>__('lang.cover_photo')]) ,
            'cover_photo.mimes'            => __('validation.mimes',['attribute'=>__('lang.cover_photo')]) ,
            'cover_photo.max'              => __('validation.max',['attribute'=>__('lang.cover_photo')]) ,
            'twitter.active_url'           => __('validation.active_url',['attribute'=>__('lang.twitter')]) ,
            'twitter.starts_with'          => __('validation.starts_with',['attribute'=>__('lang.twitter'),'values'=>'https://twitter.com/']) ,
            'facebook.active_url'          => __('validation.active_url',['attribute'=>__('lang.facebook')]) ,
            'facebook.starts_with'         => __('validation.starts_with',['attribute'=>__('lang.facebook'),'values'=>'https://facebook.com/,https://fb.com/']) ,
            'instagram.active_url'         => __('validation.active_url',['attribute'=>__('lang.instagram')]) ,
            'instagram.starts_with'        => __('validation.starts_with',['attribute'=>__('lang.instagram'),'values'=>'https://instagram.com/']) ,
            'categories.array'             => __('validation.array',['attribute'=>__('lang.categories')]) ,
            'categories.*'                 => __('validation.exists',['attribute'=>__('lang.categories')]) ,
            'experience.integer'           => __('validation.integer',['attribute'=>__('lang.experience')]) ,
            'price_range.string'           => __('validation.string',['attribute'=>__('lang.price_range')]) ,
            'area_id.integer'              => __('validation.integer',['attribute'=>__('lang.area_id')]) ,
            'area_id.exists'               => __('validation.exists',['attribute'=>__('lang.area_id')]) ,
            'designer_identity.array'      => __('validation.array',['attribute'=>__('lang.designer_identity')]) ,
            'commerical_registeration.array'=> __('validation.array',['attribute'=>__('lang.commerical_registeration')]) ,
            'tax_id.array'                 => __('validation.array',['attribute'=>__('lang.tax_id')]) ,
        ];

        $langs = getLanguages();
        foreach ($langs as $lang) {
            $messages['company_name.'. $lang['locale'].'.unique']    = __('validation.unique',['attribute'=>__('lang.company_name.'. $lang['locale'])]) ;
            $messages['company_name.'. $lang['locale'].'.required']  = __('validation.required',['attribute'=>__('lang.company_name.'. $lang['locale'])]) ;
            $messages['company_name.'. $lang['locale'].'.string']    = __('validation.string',['attribute'=>__('lang.company_name.'. $lang['locale'])]) ;
            $messages['company_name.'. $lang['locale'].'.min']       = __('validation.min.string',['attribute'=>__('lang.company_name.'. $lang['locale']),'min'=>'2']) ;
            $messages['company_name.'. $lang['locale'].'.max']       = __('validation.min.string',['attribute'=>__('lang.company_name.'. $lang['locale']),'max'=>'100']) ;
            $messages['job_title.'. $lang['locale'].'.required']     = __('validation.required',['attribute'=>__('lang.job_title.'. $lang['locale'])]) ;
            $messages['job_title.'. $lang['locale'].'.string']       = __('validation.string',['attribute'=>__('lang.job_title.'. $lang['locale'])]) ;
            $messages['job_title.'. $lang['locale'].'.min']       = __('validation.min.string',['attribute'=>__('lang.job_title.'. $lang['locale']),'min'=>'2']) ;
            $messages['job_title.'. $lang['locale'].'.max']       = __('validation.min.string',['attribute'=>__('lang.job_title.'. $lang['locale']),'max'=>'100']) ;
            $messages['bio.'. $lang['locale'].'.string']             = __('validation.string',['attribute'=>__('lang.bio.'. $lang['locale'])]) ;
            $messages['address.'. $lang['locale'].'.string']         = __('validation.string',['attribute'=>__('lang.address.'. $lang['locale'])]) ;
        }
        return $messages;
    }
}
