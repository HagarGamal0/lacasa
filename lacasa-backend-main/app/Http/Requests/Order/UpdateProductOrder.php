<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductOrder extends FormRequest
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
            // 'status' => 'string|in:Processing,Confirmed,Pending payment,Delivered,Shipped,Cancelled,Returned,Rejected,Refunded,Delivered failed|required',
            'price' => 'integer|required',
            'quantity' => 'integer|required',
            'shipping_fees' => 'integer|required',
            'shipping_notes' => 'nullable|string',
        ];
    }
}
