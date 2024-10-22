<?php

namespace App\Http\Services\Orders;

use App\Models\Catalog\Product\Product;
use App\Models\PaymentMethod;
use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Offer\Coupon;
use App\Models\Sales\Offer\OrangeVoucher;
use App\Models\Sales\Order\Order;
use App\Models\User\AddressBook;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use DB;
use App\Models\World\City;
use App\Traits\GeneralResponse;
class Discount
{

    /**
     * Coupon Discount
     *
     * @param mixed $products
     * @param mixed $coupon
     * @param mixed $address
     */
    public function coupons($products, $coupon, $address)
    {
        // Validate Coupon
        $coupon = $this->validateCoupon($products, $coupon, $address);
        // Apply Coupon Codes;
        $couponProduct = $coupon->products->pluck('id');
        $match_ids = collect(collect($products)->pluck('product_id'))->intersect($couponProduct);
        if ( $coupon->allocation_method == 'each') {
            $orderTotal = 0 ;
            $matchProducts = $products->whereIn('product_id',$couponProduct->toArray());
            $discount      = $this->GetCouponDiscountValues($matchProducts, $coupon);
            foreach ($products as $product) {
                if (\in_array($product->product_id, $match_ids->toArray(), true)) {
                    $product->update([
                        'discounts->coupons' => [
                            'title' => 'Coupon code',
                            'value' => $product->subtotal * ($discount['precentage'] / 100),
                            'description' => $coupon->coupon_code,
                        ],
                    ]);
                    $orderTotal  +=  $product->total;
                }
            }
            if($orderTotal == 0){
                $this->clearDiscount($products, 'coupons');
                throw ValidationException::withMessages([
                    'coupon' => __('lang.Order did not have product match to this coupon.'),
                ]);
            }
            if ($coupon->min_purchase > $orderTotal  ) {
                $this->clearDiscount($products, 'coupons');
                throw ValidationException::withMessages([
                    'coupon' => __('lang.Order did not reach the minimum purchase price.'),
                ]);
            }
        } else {
            $discount = $this->GetCouponDiscountValues($products, $coupon);
            foreach ($products as $product) {
                $product->update([
                    'discounts->coupons' => [
                        'title' => 'Coupon code',
                        'value' => $product->subtotal * ($discount['precentage'] / 100),
                        'description' => $coupon->coupon_code,
                    ],
                ]);
            }
        }

        return $products;
    }

    public function freeShippingCoupons($products, $coupon, $address)
    {
        // Validate Coupon
        $coupon = $this->validateCoupon($products, $coupon, $address);
        // Apply Coupon Codes;
        $match_ids = Coupon::FreeShippingCategoryMathId;
        $discount  = $this->GetCouponDiscountValuesFreeShipping($products, $coupon);
        foreach ($products as $product) {
            $ProductsCategories = collect($product->product->categories->pluck('id'))->toArray();
            $arrayFound = array_intersect($ProductsCategories, $match_ids);
            if (!empty($arrayFound)) {
                $product->update([
                    'discounts->coupons' => [
                        'title' => 'Coupon code',
                        'value' => $product->total_shipping_fees * ($discount['precentage'] / 100),
                        'description' => $coupon->coupon_code,
                    ],
                ]);
            }
        }

        return $products;
    }

    public function validateCoupon($products, $coupon, $address)
    {

        $coupon = Coupon::whereRaw('BINARY coupon_code = ?', [$coupon])->first();
        if(! $coupon){
            throw ValidationException::withMessages([
                'coupon' => __('lang.Coupon not Found'),
            ]);
        }
        if (! Carbon::parse($coupon->start_date)->lte(Carbon::now())) {
            throw ValidationException::withMessages([
                'coupon' =>__('lang.Coupon not Found',['value'=> Carbon::parse($coupon->start_date)->toDayDateTimeString()]),
            ]);
        }
        if (! Carbon::parse($coupon->expiry)->gte(Carbon::now())) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Coupon code is expired'),
            ]);
        }
        if ($coupon->first_order && User::whereEmail($address['email'])->first()->orders()->count() > 0) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Coupon is valid only for the first order'),
            ]);
        }
        $user_used_addresses = AddressBook::whereIn('email', User::whereEmail($address['email'])->first()->addressbooks()->pluck('email'))->pluck('id');
        if (Order::whereIn('address_book_id', $user_used_addresses)->whereCouponId($coupon->id)->count() >= $coupon->usage_limit_per_user) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Coupon already exceeded the usage limit.'),
            ]);
        }
        if ($coupon->min_quantity > $products->sum('quantity')) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Order did not reach the minimum quantity.'),
            ]);
        }
        if ($coupon->min_purchase > $products->sum('total')) {
            throw ValidationException::withMessages([
                'coupon' => __('lang.Order did not reach the minimum purchase price.'),
            ]);
        }
        if($coupon->coupon_code == Coupon::FreeShippingCode){
            $CityName = City::where('id',$address->area->city->id)->first();
            if(!in_array($CityName->name , ['North Coast','El Gouna'])){
                throw ValidationException::withMessages([
                    'coupon' => __('lang.Coupon not valide in this city',['city'=>$CityName->name]),
                ]);  
            }
            if ('precentage' === $coupon->discount_type && ($products->sum('total_shipping_fees') * $coupon->discount_value) / 100 > $coupon->max_discount) {
                $coupon['discount_value'] = $coupon->max_discount / $products->sum('total_shipping_fees') * 100;
            }
        }else{
            if ( $coupon->max_discount > 0 && 'precentage' === $coupon->discount_type && ($products->sum('subtotal') * $coupon->discount_value / 100) > $coupon->max_discount) {
                $coupon['discount_value'] = $coupon->max_discount / $products->sum('subtotal') * 100;
            }
        }
   
        return $coupon;
    }

    public function GetCouponDiscountValues($products, $coupon)
    {
        $discount = [];
        if ('fixed' === $coupon->discount_type) {
            $discount['fixed'] = $coupon->discount_value; // Discount Fixed value;
            $discount['precentage'] = $products->sum('subtotal') != 0 ? (($discount['fixed'] / $products->sum('subtotal')) * 100) : 0;
        } else {
            $discount['fixed']      = $products->sum('subtotal') * ((int)($coupon->discount_value) / 100); // Discount Fixed value;
            $discount['precentage'] = $coupon->discount_value; // discount precentage;
        }

        return $discount;
    }

    public function GetCouponDiscountValuesFreeShipping($products, $coupon)
    {
        $discount = [];
        if ('fixed' === $coupon->discount_type) {
            $discount['fixed'] = $coupon->discount_value; // Discount Fixed value;
            $discount['precentage'] =$products->sum('total_shipping_fees') != 0 ? (($discount['fixed'] / $products->sum('total_shipping_fees')) * 100) : 0;;
        } else {
            $discount['fixed']      = $products->sum('total_shipping_fees') * ((int)($coupon->discount_value) / 100); // Discount Fixed value;
            $discount['precentage'] = $coupon->discount_value; // discount precentage;
        }

        return $discount;
    }
    /**
     * END of Coupon Discounts
     *
     * @param mixed $products
     * @param mixed $voucher
     */

    /**
     * Orange Voucher Discount
     */
    public function orange($products, $voucher)
    {
        $voucher = OrangeVoucher::find($voucher);
        if ($voucher) {
            if ($voucher->is_redeemed) {
                throw ValidationException::withMessages(['voucher_id' => __('lang.Voucher was already redeemed')]);
            }
            $discount = $voucher->value;

            foreach ($products as $product) {
                $product->update([
                    'discounts->orange_discount' => [
                        'title' => 'Orange Voucher',
                        'value' => $voucher->value / $products->count(),
                        'description' => 'Purchase from ' . $voucher->mobile,
                    ],
                ]);
            }
        }
    }

    /**
     * End of Orange Voucher Discount
     *
     * @param mixed $products
     * @param mixed $payment_method
     */
    public function applyPaymentMethodDiscount($products, $payment_method)
    {
        $orderSubtotal = $products->sum('subtotal');
        foreach ($products as $product) {
            $excluded_categories = $product->product->categories->whereIn('name',PaymentMethod::CategoryExpection);
            if ($excluded_categories->count() > 0) {
                if (( $payment_method != 2) && ( $payment_method != 1)){
                    throw ValidationException::withMessages([
                        'error' => __('lang.InstallmentNotAppliedInThisProduct',['Product' => $product->product->name]),
                    ]);
                }

                $discount = 0;
                $orderSubtotal = $orderSubtotal - $product->subtotal;
            }else{
                $_products[] = $product;
            }
        }
        if(!empty($_products)){
            if (( $payment_method === 2) && ($orderSubtotal >= PaymentMethod::OrderLIMITD)) {
                $orderDiscount = ($orderSubtotal * PaymentMethod::PAYMENTDiscountPrecent) > PaymentMethod::PAYMENTLIMITDICOUNT ? PaymentMethod::PAYMENTLIMITDICOUNT : (int)($orderSubtotal * PaymentMethod::PAYMENTDiscountPrecent);
                foreach ($_products as $_product) {
                    $discount = round(($_product->sub_total / $orderSubtotal) * $orderDiscount,2);
                    $_product->update([
                        'discounts->payment_discount' => [
                            'title' => 'Payment Method Discount',
                            'value' => $discount,
                            'description' => 'Debit Card Discount',
                        ],
                    ]);
                    $_discount[]= $discount;
                }
            } else {
                $discount = 0;
                foreach ($_products as $_product) {
                    $_product->update([
                        'discounts->payment_discount' => [
                            'title' => 'Payment Method Discount',
                            'value' => $discount,
                            'description' => 'Debit Card Discount',
                        ],
                    ]);
                }
            }
        }

 
    }

    public function applyShippingDiscount($products, $address)
    {
        $vendorProducts = []; // Array to store purchased products grouped by vendor

        // Group the products by vendor
        foreach ($products as $product) {
            $vendorId = $product->vendor_id;
            if (! isset($vendorProducts[$vendorId])) {
                $vendorProducts[$vendorId] = [];
            }
            $vendorProducts[$vendorId][] = $product;
        }

        // Apply discount for each vendor separately
        foreach ($vendorProducts as $vendorId => $productsByVendor) {
            $totalQuantityByVendor = 0;

            foreach ($productsByVendor as $product) {
                $totalQuantityByVendor += $product->quantity;
            }

            // Check if the total quantity purchased from the same vendor is at least 2
            if ($totalQuantityByVendor >= 2) {
                // Check if the address city is either 'Giza' or 'Cairo'
                if (\in_array($address->city->name, ['Giza', 'Cairo'], true)) {
                    $discountPercentage = 0.50; // Apply a 50% discount
                } else {
                    $discountPercentage = 0.25; // Apply a 25% discount
                }

                // Check if any product in the vendor's items belongs to the 'APPLIANCES' category
                $excludedCategories = collect($productsByVendor)->pluck('product.categories')->flatten()->where('name', 'APPLIANCES');
                if ($excludedCategories->count() > 0) {
                    $discountPercentage = 0; // If any product belongs to the 'APPLIANCES' category, set discount to 0 (no discount).
                }

                // Apply the discount to each product in the vendor's items
                foreach ($productsByVendor as $product) {
                    $discount = $product->shipping_fees * $discountPercentage;

                    // Update the product with the calculated shipping discount.
                    $product->update([
                        'discounts->shipping_discount' => [
                            'title' => 'Shipping discount',
                            'value' => $discount,
                            'description' => 'Multiple quantity discount',
                        ],
                    ]);
                }
            } else {
                // If the total quantity from the same vendor is less than 2, set discount to 0 (no discount).
                foreach ($productsByVendor as $product) {
                    $product->update([
                        'discounts->shipping_discount' => [
                            'title' => 'Shipping discount',
                            'value' => 0,
                            'description' => 'Multiple quantity discount',
                        ],
                    ]);
                }
            }
        }
    }


    public function clearDiscount($products, $type)
    {
        foreach ($products as $product) {
            $product->update([
                "discounts->{$type}" => [
                    'title' => null,
                    'value' => 0,
                ],
            ]);
        }
    }
}
