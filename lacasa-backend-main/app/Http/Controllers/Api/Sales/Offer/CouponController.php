<?php

namespace App\Http\Controllers\Api\Sales\Offer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateCoupon;
use App\Http\Requests\Order\UpdateCoupon;
use App\Http\Requests\Order\ValidateCoupon;
use App\Http\Resources\Order\CouponResource;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Offer\Coupon;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use DB;
use Illuminate\Support\Str;

class CouponController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum'])->except(['validateByName']);
    }

    public function index()
    {
        return CouponResource::collection(QueryBuilder::for(Coupon::class)
        ->allowedFilters([
            'coupon_code',
            'discount_value',
        ])
        ->paginate());
    }

    public function show($id)
    {
        return new CouponResource(Coupon::find($id));
    }

    public function destroy($id)
    {
        Coupon::find($id)->delete();

        return [
            'code' => 200,
            'status' => 'success',
            'data' => [],
        ];
    }

    public function validateByName(ValidateCoupon $request)
    {
        $order = $request->validated();

        $products = $order['products'];
        $products = collect($products)->map(function ($product) {
            $original_product = Product::findorfail($product['id']);
            $product_vendor = $original_product->vendor->id;

            return [
                'id' => $product['id'],
                'quantity' => $product['quantity'],
                'vendor_id' => $original_product->vendor_id,
                'price' => $original_product->price_after_sale * $product['quantity'],
                'coupon_discount' => 0,
                'price_after_coupon' => $original_product->price_after_sale * $product['quantity'],
                'subtotal' => (intval($original_product->price_after_sale) * intval($product['quantity'])),
            ];
        })->toArray();
        // Apply Coupon Codes;
        if (isset($request->validated()['coupon'])) {
           $couponStr =  Str::lower($request->coupon);
            $coupon = Coupon::where('coupon_code', $couponStr)->first();
            if (! Carbon::parse($coupon->expiry)->gte(Carbon::now())) {
                throw ValidationException::withMessages([
                    'coupon' => 'Coupon code is expired',
                ]);
            }

            if ($coupon->has_vendors) {
                $cart_ids = collect($products)->pluck('vendor_id');
                $coupon_ids = $coupon->vendors->pluck('id');
                $match_ids = collect($cart_ids)->intersect($coupon_ids);
                $products = collect($products)->map(function ($product) use ($match_ids, $coupon) {
                    if ($coupon->discount_type == 'fixed' && in_array($product['vendor_id'], $match_ids->toArray())) {
                        $discount_fixed = $coupon->discount_value;
                        $discount_precentage = $discount_fixed / intval($product['price']) * 100;
                        $coupon_discount = $product['price'] * ($discount_precentage / 100);
                    } elseif ($coupon->discount_type == 'precentage' && in_array($product['vendor_id'], $match_ids->toArray())) {
                        $discount_fixed = (intval($product['price']) * (intval($coupon->discount_value) / 100));
                        $discount_fixed = $coupon->discount_value;
                        $discount_precentage = $discount_fixed / intval($product['price']) * 100;
                        $coupon_discount = $product['price'] * ($discount_precentage / 100);
                    } else {
                        $coupon_discount = 0;
                        $discount_fixed = 0;
                    }

                    return [
                        'id' => $product['id'],
                        'price' => $product['price'],
                        'coupon_discount' => $coupon_discount,
                        'price_after_coupon' => $product['price'] - $coupon_discount,
                        'subtotal' => $product['subtotal'],
                    ];
                });
            } else {
                $products = collect($products)->map(function ($product) use ($coupon) {
                    if ($coupon->discount_type == 'fixed') {
                        $discount_fixed = $coupon->discount_value;
                        $discount_precentage = $coupon->discount_value;
                    } else {
                        $discount_fixed = intval($product['price']) * (intval($coupon->discount_value) / 100);
                        $discount_precentage = $discount_fixed / intval($product['price']) * 100;
                    }

                    return [
                        'id' => $product['id'],
                        'price' => $product['price'],
                        'coupon_discount' => $discount_fixed,
                        'price_after_coupon' => $product['price'] - $discount_fixed,
                        'subtotal' => $product['subtotal'],
                    ];
                });
            }
        }

        return [
            'products' => $products,
            'original_subtotal' => collect($products)->sum('subtotal'),
            'subtotal' => collect($products)->sum('price'),
            'coupon_discount' => collect($products)->sum('coupon_discount'),
            'total' => intval(collect($products)->sum('price')) - intval(collect($products)->sum('coupon_discount')),
        ];
    }

    public function store(CreateCoupon $request)
    {
        $coupon = $request->validated();
        $coupon['coupon_code'] =  Str::lower($coupon['coupon_code']);
        $create_coupon = Coupon::create(collect($coupon)->except(['products'])->toArray());

        $products = $request->validated()['products'];
        $products['vendors'] = ! empty($products['vendors']) ? $products['vendors'] : [];
        $products['categories'] = ! empty($products['categories']) ? $products['categories'] : [];
        $products['exclude_categories'] = ! empty($products['exclude_categories']) ? $products['exclude_categories'] : [];
        $products['include'] = ! empty($products['include']) ? $products['include'] : [];
        $products['exclude'] = ! empty($products['exclude']) ? $products['exclude'] : [];
        $products['vendor_categories'] = ! empty($products['vendor_categories']) ? $products['vendor_categories'] : [];
        $bulk = Product::whereIn('vendor_id', $products['vendors'])
        ->orWhereIn('id', $products['include'])
        ->get();
        if(!empty($products['exclude_categories'])){
            $create_coupon->categories()->sync($products['exclude_categories']);
        }  
        if (count($products['exclude_categories']) > 0) {
            $bulk = Product::whereDoesntHave('categories', function ($query) use ($products) {
                $query->whereIn('id', $products['exclude_categories']);
            })->get()->merge($bulk);
        }
        $products = $bulk->whereNotIn('id', $products['exclude'])->values()->pluck('id');
        $create_coupon->products()->sync($products);

        return new CouponResource($create_coupon);
    }

    public function update($id,UpdateCoupon $request)
    {
        $coupon = $request->validated();
        $updateCoupon =   Coupon::find($id);
        $coupon['coupon_code'] =  Str::lower($coupon['coupon_code']);
        $updateCoupon->update(collect($coupon)->except(['products'])->toArray());
        // $products = $request->validated()['products'];
        // $products['categories']         = ! empty($products['categories']) ? $products['categories'] : [];
        // $products['vendors']            = ! empty($products['vendors']) ? $products['vendors'] : [];
        // $products['exclude_categories'] = ! empty($products['exclude_categories']) ? $products['exclude_categories'] : [];
        // $products['include']            = ! empty($products['include']) ? $products['include'] : [];
        // $products['exclude']            = ! empty($products['exclude']) ? $products['exclude'] : [];
        // $products['vendor_categories']  = ! empty($products['vendor_categories']) ? $products['vendor_categories'] : [];
        // $bulk = Product::whereIn('vendor_id', $products['vendors'])->orWhereIn('id', $products['include'])->get();

        // if(!empty($products['exclude_categories'])){
        //     $updateCoupon->categories()->sync($products['exclude_categories']);
        // } 

        // if (count($products['exclude_categories']) > 0) {
        //     $bulk = Product::whereDoesntHave('categories', function ($query) use ($products) {
        //                 $query->whereIn('id', $products['exclude_categories']);
        //             })->get()->merge($bulk);
        // }

        // $products = $bulk->whereNotIn('id', $products['exclude'])->values()->pluck('id');
        // $updateCoupon->products()->sync($products);
        return new CouponResource($updateCoupon);
    }
}
