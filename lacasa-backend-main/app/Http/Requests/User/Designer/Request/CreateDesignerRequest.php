<?php

namespace App\Http\Requests\User\Designer\Request;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateDesignerRequest extends FormRequest
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
            'designer_id'         => ['required', 'integer', 'exists:designers,user_id'],
            'project_sector'      => ['required', 'integer'],
            'project_location'    => ['required', 'string'],
            'project_area'        => ['required', 'integer'],
            'project_descreption' => ['required', 'string'],
            'desired_service'     => ['required', 'integer'],
            'style_descreption'   => ['nullable', 'string'],
            'name'                => ['required', 'string','min:4'],
            'email'               => ['required', 'email'],
            'phone'               => ['required','digits:11'],
            'phone_communication' => ['required', 'boolean'],
            'email_communication' => ['required', 'boolean'],
            'whatsapp_communication' => ['required', 'boolean'],
            'f_10_to_5_am'        => ['required', 'boolean'],
            'f_5_to_10_am'        => ['required', 'boolean'],
            'f_10_to_5_pm'        => ['required', 'boolean'],
            'f_5_to_10_pm'        => ['required', 'boolean'],
            'project_scope'       => ['required', 'string'],
            'drawing.*'           => ['file','nullable', 'mimes:png,jpg,svg'],   
            'inspirations.*'      => ['file','nullable', 'mimes:png,jpg,svg'],   
        ];
    }

    public function messages()
    {
        return [
            'designer_id.required'     =>__('validation.required',['attribute'=>__('lang.designer_id')]),
            'designer_id.integer'      =>__('validation.integer',['attribute'=>__('lang.designer_id')]),
            'designer_id.exists'       =>__('validation.exists',['attribute'=>__('lang.designer_id')]),
            'designer_id.required'     =>__('validation.required',['attribute'=>__('lang.designer_id')]),
            'designer_id.integer'      =>__('validation.integer',['attribute'=>__('lang.designer_id')]),
            'project_location.required'     =>__('validation.required',['attribute'=>__('lang.project_location')]),
            'project_location.integer'      =>__('validation.integer',['attribute'=>__('lang.project_location')]),
            'project_area.required'     =>__('validation.required',['attribute'=>__('lang.project_area')]),
            'project_area.integer'      =>__('validation.integer',['attribute'=>__('lang.project_area')]),
            'project_area.project_descreption'     =>__('validation.required',['attribute'=>__('lang.project_descreption')]),
            'project_area.project_descreption'      =>__('validation.integer',['attribute'=>__('lang.project_descreption')]),
            'project_area.desired_service'          =>__('validation.required',['attribute'=>__('lang.desired_service')]),
            'project_area.desired_service'          =>__('validation.integer',['attribute'=>__('lang.desired_service')]),
            'style_descreption.string'              =>__('validation.string',['attribute'=>__('lang.style_descreption')]),
            'name.string'     =>__('validation.string',['attribute'=>__('lang.name')]),
            'name.required'     =>__('validation.string',['attribute'=>__('lang.name')]),
            'name.min'     =>__('validation.min.string',['attribute'=>__('lang.name',['min'=>4])]),
            'email.email'     =>__('validation.email',['attribute'=>__('lang.email')]),
            'email.required'     =>__('validation.string',['attribute'=>__('lang.email')]),
            'phone.digits'     =>__('validation.phone',['attribute'=>__('lang.phone',['digits'=>11])]),
            'phone.required'     =>__('validation.string',['attribute'=>__('lang.phone')]),
            'phone_communication.required'     =>__('validation.required',['attribute'=>__('lang.phone_communication')]),
            'phone_communication.boolean'      =>__('validation.integer',['attribute'=>__('lang.phone_communication')]),
            'email_communication.required'     =>__('validation.required',['attribute'=>__('lang.email_communication')]),
            'email_communication.boolean'      =>__('validation.integer',['attribute'=>__('lang.email_communication')]),
            'whatsapp_communication.required'     =>__('validation.required',['attribute'=>__('lang.whatsapp_communication')]),
            'whatsapp_communication.boolean'      =>__('validation.integer',['attribute'=>__('lang.whatsapp_communication')]),
            'f_10_to_5_am.required'     =>__('validation.required',['attribute'=>__('lang.f_10_to_5_am')]),
            'f_10_to_5_am.boolean'      =>__('validation.integer',['attribute'=>__('lang.f_10_to_5_am')]),
            'f_5_to_10_am.required'     =>__('validation.required',['attribute'=>__('lang.f_5_to_10_am')]),
            'f_5_to_10_am.boolean'      =>__('validation.integer',['attribute'=>__('lang.f_5_to_10_am')]),
            'f_10_to_5_pm.required'     =>__('validation.required',['attribute'=>__('lang.f_10_to_5_pm')]),
            'f_10_to_5_pm.boolean'      =>__('validation.integer',['attribute'=>__('lang.f_10_to_5_pm')]),
            'f_5_to_10_pm.required'     =>__('validation.required',['attribute'=>__('lang.f_5_to_10_pm')]),
            'f_5_to_10_pm.boolean'      =>__('validation.integer',['attribute'=>__('lang.f_5_to_10_pm')]),
        
            'project_scope.required'     =>__('validation.required',['attribute'=>__('lang.project_scope')]),
            'project_scope.string'      =>__('validation.string',['attribute'=>__('lang.project_scope')]),
        
            'drawing.required'     =>__('validation.file',['attribute'=>__('lang.drawing')]),
            'drawing.mimes'      =>__('validation.mimes',['attribute'=>__('lang.drawing',['drawing'=>'png,jpg,svg'])]),
        
            'inspirations.required'     =>__('validation.file',['attribute'=>__('lang.inspirations')]),
            'inspirations.mimes'      =>__('validation.mimes',['attribute'=>__('lang.inspirations',['drawing'=>'png,jpg,svg'])]),
        
        
        ];
    }
}
