<?php

namespace App\Http\Services\Orders;

use App\Models\Catalog\Product\AttributeValue;
use App\Models\Catalog\Product\Product;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class InitializeCart
{
    public function init($order, $request)
    {
        $address = (new ValidateUser)->address($order);
        $products = $this->prepare($order, $request, $address);
        $orange_voucher = (new Discount)->orange($request);

        return [
            'products' => $products,
            'orange_voucher' => $orange_voucher,
            'address' => $address,
        ];
    }

    // $products = $this->initializeCart($order, $request, $address);
    public function prepare($order, $request, $address)
    {
        //Generate Order Product With Original Values;
        $products = collect($order['products'])->map(function ($product) use ($address) {
            // Get the product original values;
            $original_product = Product::findorfail($product['id']);
            // Validate the purchased attribute value
            $attributes = $this->validateAttributes($product, $original_product);

            // Check Original Product Price;
            $original_price = $attributes['subtotal'];
            // $original_price = $this->retriveOriginalPrice($order, $original_product, $product);
            // Get Flash Sale Discount;
            // $flash_sale_discount = $this->retriveFlashSaleDiscount($order,$original_price, $original_product, $product);
            $flash_sale_discount = 0;
            // Get Product Shipping Fees;
            $original_shipping_fees = $this->retriveShippingInfo($address->city->id, $original_product);

            return [
                'id' => $product['id'],
                'quantity' => $product['quantity'],
                // 'attributes' => json_encode(collect($attributes)),
                'attributes' => $attributes,
                'vendor_id' => $original_product->vendor_id,
                'original_price' => $original_price,
                'price' => $original_price,
                'original_subtotal' => $original_price * $product['quantity'],
                'purchase_price' => $original_price - $flash_sale_discount,
                'flash_sale_discount' => $flash_sale_discount * $product['quantity'],
                'subtotal' => $original_price * $product['quantity'],
                'flash_sale' => isset($flash_sale) ? true : false,
                'original_shipping_fees' => $original_shipping_fees->fee * $product['quantity'],
            ];
        });
        // return $products;
        // Apply Coupon codes if exists
        //validate Coupon Code,
        if (isset($request->validated()['coupon'])) {
            // $products = $this->applyCoupon($products, $order['coupon'], $address);
            $products = (new Discount)->coupons($products, $order['coupon'], $address);
        }

        $products = (new Discount)->applyPaymentMethodDiscount($products, $order['payment_method']);

        // Apply Shipping Discount depending on quantities;
        $products = (new Discount)->applyShippingDiscount($products, $address);
        // return $products = isset($request->validated()['coupon']) ?  : $products;

        //Calculate Totals
        $products = collect($products)->map(function ($product) {
            if (isset($product['coupon_discount']) && $product['coupon_discount'] > 0) {
                $product['payment_method_discount'] = 0;
            }
            $product['coupon_discount'] = isset($product['coupon_discount']) ? $product['coupon_discount'] : 0;
            $original_product = Product::findorfail($product['id']);
            $product['shipping_fees'] = $product['original_shipping_fees'] - $product['shipping_discount'];
            $product['subtotal_after_discounts'] = $product['subtotal'] - $product['flash_sale_discount'] - $product['coupon_discount'] - $product['payment_method_discount'];
            $product['subtotal'] = $product['subtotal'] - $product['flash_sale_discount'] - $product['coupon_discount'] - $product['payment_method_discount'];
            $product['purchase_price'] = $product['subtotal'] - $product['flash_sale_discount'] - $product['coupon_discount'] - $product['payment_method_discount'];
            $product['commission'] = $product['subtotal_after_discounts'] * $original_product->vendor->vendor->commission / 100;
            $product['vendor_revenue'] = ($product['subtotal_after_discounts']) - ($product['subtotal_after_discounts'] * $original_product->vendor->vendor->commission / 100);

            $product['total'] = $product['subtotal_after_discounts'] + $product['shipping_fees'];
            // $product['total'] = $product['subtotal']-$product['flash_sale_discount']-$product['coupon_discount']+$product['shipping_fees'];

            return $product;
        });

        return $products;
    }

    public function validateAttributes($product, $original_product)
    {
        $attributes = collect([]);
        if (isset($product['attributes'])) {
            foreach ($product['attributes'] as $product_attribute) {
                $attribute = $original_product->attribute_values()->where('attribute_values.id', $product_attribute)->first();
                if ($attribute) {
                    $attribute = [
                        'key' => $attribute->attribute->name,
                        'value' => $attribute->value,
                        'price' => $attribute->pivot->price_after_sale ?: 0,
                    ];
                    $attributes->push($attribute);
                } else {
                    throw ValidationException::withMessages([
                        'attribute_id' => 'Attribute value (' . $product_attribute . ') doesnt exist in product (' . $product['id'] . ')',
                    ]);
                }
            }
        }
        if (isset($product['fabric_color'])) {
            $attribute = [
                'key' => 'Fabric Color',
                'value' => $product['fabric_color'],
                'price' => 0,
            ];
            $attributes->push($attribute);
        }

        return [
            'quantity' => $product['quantity'],
            'subtotal' => collect($attributes)->sum('price') ?: $original_product->price_after_sale,
            'options' => $attributes,
        ];
    }

  //
  //
    // public function validateAttributes($product)
    // {
  //     $attributes = collect([]);
  //     if (isset($product['attributes'])) {
  //         foreach ($product['attributes'] as $product_attribute) {
  //             if (!Product::whereId($product['id'])->whereHas('attribute_values', function ($q) use ($product_attribute) {
  //                 $q->where('attribute_value_id', $product_attribute);
  //             })->first()) {
  //                 throw ValidationException::withMessages([
  //                     'attribute_id' => 'Attribute value (' . $product_attribute . ') doesnt exist in product (' . $product['id'] . ')',
  //                 ]);
  //             }
  //             $attribute_value = AttributeValue::findorfail($product_attribute);
  //             $attribute = [
  //                 'key' => $attribute_value->attribute->name,
  //                 'value' => $attribute_value->value,
  //                 'price' => $attribute_value,
  //             ];
  //             $attributes->push($attribute);
  //         }
  //     }
  //     if (isset($product['fabric_color'])) {
  //         $attribute = [
  //             'key' => 'Fabric Color',
  //             'value' => $product['fabric_color'],
  //         ];
  //         $attributes->push($attribute);
  //     }
  //     return [
  //       "quantity" => $product['quantity'],
  //       // "price" => $product['quantity'],
  //       "options" => $attributes
  //     ];
    // }
  //
    // public function retriveOriginalPrice($order, $original_product, $product)
    // {
    //   // Get original price from product or attribute;
    //   if(isset($product['attributes'])){
  //     $attribute_with_price = $original_product->attribute_values()->whereIn('attribute_value_id', $product['attributes'])->wherePivot('price_after_sale', '!=', null)->first();
  //     if ($attribute_with_price) {
  //         $original_price = $attribute_with_price->pivot->price_after_sale;
  //     } else {
  //         $original_price = $original_product->price_after_sale;
  //     }
    //   }else{
  //     $original_price = $original_product->price_after_sale;
    //   }
  //
    //   // return [
    //   //   'flash_sale_discount' => isset($flash_sale_discount) ? $flash_sale_discount : 0,
    //   //   'original_price' => $original_price,
    //   //   'price_after_flash_sale' => isset($price_after_flash_sale) ? $price_after_flash_sale : $original_price,
    //   // ];
  //
    //   return $original_price;
    // }

    public function retriveShippingInfo($city, $original_product)
    {
        $flash_sale = $original_product->flash_sale()->first();
        if ($flash_sale && $flash_sale?->expire_at > Carbon::now() && $flash_sale?->shipping_profile()->first()) {
            $shipping_rule = $flash_sale->shipping_profile->shipping_rules()->whereCityId($city)->first();
        } else {
            $shipping_rule = $original_product->shipping_profile()->first()->shipping_rules()->whereCityId($city)->first();
        }

        if ($shipping_rule->is_disabled) {
            throw ValidationException::withMessages([
                'city' => $original_product['name'] . ' is not eligible for shipping to this area.',
            ]);
        }

        $shipping_fees = collect();
        $shipping_fees->fee = $shipping_rule->shipping_fee;
        $shipping_fees->estimated_delivery = $shipping_rule->estimated_delivery;

        return $shipping_fees;
    }

    public function validateProducts($products)
    {
        $active_products = collect();
        $inactive_products = collect();
        foreach (collect($products) as $product) {
            $original_product = Product::whereId($product['id'])->first();
            if ($original_product->status == 'Published' && $original_product->stock >= $product['quantity']) {
                $active_products->push($product);
            } else {
                $inactive_products->push($product);
            }
        }

        return ['data' => ['active' => $active_products, 'inactive' => $inactive_products]];
    }
}
