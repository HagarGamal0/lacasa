<?php

namespace App\Http\Requests;

use App\Enums\RequestStatustypeEnum;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ChangeStatusRequest extends FormRequest
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
            'status'     => ['required',Rule::in([RequestStatustypeEnum::Pending,RequestStatustypeEnum::Contacted,RequestStatustypeEnum::Closed])],
        ];
    }
}
