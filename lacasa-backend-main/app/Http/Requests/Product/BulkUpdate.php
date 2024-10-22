<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdate extends FormRequest
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
            'select_by' => 'required|in:vendor,products',
            'products' => 'array|nullable|required_if:select_by,products',
            'products.*' => 'integer|nullable|required_if:select_by,products|exists:products,id',
            'vendor_id' => 'integer|required_if:select_by,vendor|exists:users,id',
            'status' => 'nullable|in:Published,Pending,Draft,Trash',
            'featured' => 'nullable|in:0,1',
            'categories' => 'array|nullable',
            'categories.*' => 'integer|exists:categories,id',
            'fixed_equation' => 'numeric|nullable',
            'to_vendor_id' => 'integer|nullable',
            'numberType' => 'integer|in:0,1',
        ];
    }
}
