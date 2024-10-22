<?php

namespace App\Http\Controllers\Api\Sales\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\ValidateCoupon;
use App\Models\Sales\Cart\Cart;
use App\Models\Sales\Offer\Coupon;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class CouponController extends Controller
{
    public function validateByName(ValidateCoupon $request, Cart $cart)
    {
        $coupon = Coupon::where('coupon_code', $request->validated()['coupon'])->first();
        if (! Carbon::parse($coupon->expiry)->gte(Carbon::now())) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Coupon code is expired'),
            ]);
        }
        // if($coupon['allocation_method'] == 'each'){
        //     foreach ($cart->items as $item) {
        //         $valid = $coupon->products->where('id', $item->product_id)->first();
        //         if (! $valid) {
        //             throw ValidationException::withMessages([
        //                 'coupon' => $item->product->name . ' is not eligible for this coupon.',
        //             ]);
        //         }
        //     }
        // }
        

        return [
            'status' => 'success',
        ];
    }
}
