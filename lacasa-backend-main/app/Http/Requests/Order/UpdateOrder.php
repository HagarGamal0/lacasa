<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrder extends FormRequest
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
            // 'status' => 'string|in:Processing,Shipping In Progress,Delivered,Cancelled|required',
            'status' => 'string|in:Processing,Confirmed,In Preparation,Pending payment,Delivered,Shipped,Cancelled,Returned,Rejected,Refunded,Delivered failed|required',
            'note' => 'string|nullable',
            // 'note' => 'string|required_if:status,Cancelled'
            // 'shipping_notes' => 'nullable|string',
        ];
    }
}
