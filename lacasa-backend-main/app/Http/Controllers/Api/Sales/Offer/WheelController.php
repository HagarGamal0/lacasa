<?php

namespace App\Http\Controllers\Api\Sales\Offer;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateWheelRequest;
use App\Http\Requests\UpdateWheelRequest;
use App\Http\Resources\Offer\WheelOffer as WheelOfferResource;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Offer\Coupon;
use App\Models\Sales\Offer\WheelOffer;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Str;

class WheelController extends Controller
{
    public function index()
    {
        return WheelOfferResource::collection(WheelOffer::all());
    }

    public function store(CreateWheelRequest $request)
    {
        $offer = $request->validated();
        $offer['products'] = json_encode($offer['products']);
        $offer = WheelOffer::create($offer);
        if (! $offer->is_winable) {
            return new WheelOfferResource($offer);
        }
        $coupon = [
            'coupon_code' => strtoupper('WHEEL-' . Str::random(4) . Auth::id() . Str::random(4)),
            'allocation_method' => 'each',
            'discount_type' => 'precentage',
            'discount_value' => $offer->value,
            'usage_limit_per_user' => '1',
            'usage_limit' => '1',
            'min_quantity' => '1',
            'min_purchase' => '10',
            'max_purchase' => '500000',
            'max_discount' => '500',
            'start_date' => Carbon::now()->format('Y-m-d'),
            'expiry' => Carbon::now()->addDays(365)->format('Y-m-d'),
            'first_order' => 0,
        ];

        //CREATE COUPON
        $create_coupon = Coupon::create($coupon);
        $products = json_decode($offer['products']);
        $products->vendors = ! empty($products->vendors) ? $products->vendors : null;
        $products->categories = ! empty($products->categories) ? $products->categories : null;
        $products->exclude_categories = ! empty($products->exclude_categories) ? $products->exclude_categories : null;
        $products->include = ! empty($products->include) ? $products->include : null;
        $products->exclude = ! empty($products->exclude) ? $products->exclude : null;
        $products->vendor_categories = ! empty($products->vendor_categories) ? $products->vendor_categories : null;

        $bulk = Product::whereDoesntHave('categories', function ($query) use ($products) {
            $query->whereIn('id', $products->exclude_categories);
        })->get();
        $products = $bulk->whereNotIn('id', $products->exclude)->values()->pluck('id');
        $create_coupon->products()->sync($products);
        $offer->update(['coupon_id' => $create_coupon->id]);

        return new WheelOfferResource($offer);
    }

    public function show($id)
    {
        return new WheelOfferResource(WheelOffer::find($id));
    }

    public function update(UpdateWheelRequest $request, $id)
    {
        $offer = $request->validated();
        WheelOffer::find($id)->update($offer);

        return $this->show($id);
    }

    public function destroy($id)
    {
        WheelOffer::find($id)->delete();

        return $this->index();
    }

    public function generate($id)
    {
        $offer = WheelOffer::with('coupon')->find($id);
        $offer->coupon()->update(['usage_limit' => $offer->coupon->usage_limit + 1]);

        return new WheelOfferResource($offer);
    }
}

