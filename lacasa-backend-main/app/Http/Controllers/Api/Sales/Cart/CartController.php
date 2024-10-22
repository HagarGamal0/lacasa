<?php

namespace App\Http\Controllers\Api\Sales\Cart;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\Cart\Cart as CartResource;
use App\Http\Services\Orders\CartService;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Cart\Cart;
use App\Models\Sales\Cart\CartItem;
use App\Traits\GeneralResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Calculation\MathTrig\Floor;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\Cast\Double;
use App\Http\Services\Orders\Discount;
class CartController extends Controller
{
    public $cartService;
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }
    public function index(Request $request, $cart = null)
    {
        $cart = Cart::valid()->find($cart) ?: Cart::valid()->whereIp($request->ip())->first();
        if (! $cart) {
            $cart = Cart::create([
                'ip' => $request->ip(),
            ]);
        } else {
            $cart->update(['ip' => $request->ip()]);
        }

        return new CartResource($cart);
    }

    public function update(Request $request, Cart $cart, $item_id)
    {
        $item = $request->validate([
            'quantity' => 'integer|min:1|required',
        ]);
        $cart->items()->findorfail($item_id)->update([
            'quantity' => $item['quantity'] ?? 1,
        ]);

        return new CartResource($cart);
    }

    public function store(Request $request, Cart $cart)
    {
        $item = $request->validate([
            'id'           => 'exists:products,id|required',
            'quantity'     => 'integer|min:1|required',
            'attributes'   => 'array|nullable',
            'attributes.*' => 'integer|exists:product_attribute_value,attribute_value_id,product_id,' . $request['id'] . '|nullable',
            'fabric_color' => 'nullable|string',
        ],[
            'id.exists'            => __('validation.exists',['attribute'=>__('lang.id')]) ,
            'id.required'            => __('validation.required',['attribute'=>__('lang.id')]) ,
            'quantity.required'            => __('validation.quantity',['attribute'=>__('lang.quantity')]) ,
            'quantity.integer'            => __('validation.integer',['attribute'=>__('lang.quantity')]) ,
            'attributes.array'            => __('validation.array',['attribute'=>__('lang.attributes')]) ,
            'attributes.array'            => __('validation.array',['attribute'=>__('lang.attributes')]) ,
            'fabric_color.string'            => __('fabric_color.string',['attribute'=>__('lang.fabric_color')]) ,
        ]);

        // Get Attribute
        $product = Product::find($item['id']);
        if ($item['attributes']) {
            $attributes = $product->attribute_values()->whereIn('attribute_value_id', $item['attributes'])->with(['attribute'])->get();
            $item_attributes = $attributes->map(function ($attribute) {
                return [
                    'id' => $attribute['id'],
                    'attribute' => $attribute['attribute']['name'],
                    'value' => $attribute['value'],
                ];
            });
        } else {
            $item_attributes = collect();
        }
        if (isset($item['fabric_color'])) {
            $item_attributes->push([
                'id' => 0,
                'attribute' => 'fabric_color',
                'value' => $item['fabric_color'],
            ]);
        }

        if (isset($attributes) && $attributes->where('pivot.price_after_sale', '>', 0)->first()) {
            $item_price = $attributes->where('pivot.price_after_sale', '>', 0)->first()?->pivot->price_after_sale;
        } else {
            $item_price = $product->price_after_sale;
        }

        $shipping_fee = $this->cartService->checkShippingFeesForItem($cart,$product->id);
        if(is_array($shipping_fee)){
            $shipping_fee = 0;
        }
        CartItem::updateOrCreate([
            'cart_id'            => $cart->id,
            'product_id'         => $item['id'],
            'attributes_decoded' => json_encode($item_attributes),
        ], [
            'attributes'    => $item_attributes,
            'quantity'      => $item['quantity'] ?? 1,
            'price'         => $item_price,
            'shipping_fees' => $shipping_fee,
            'total' => 0,
        ]);

        $ShippingFee = $this->cartService->calculateShippingFees($cart);

        $CartTotal   = $this->cartService->CartProductTotal($cart);
        
        $cart->subtotal      = $CartTotal  ;
        $cart->shipping_fees = $ShippingFee;
        $cart->total         = $CartTotal + $ShippingFee;
        $cart->save();
        return new CartResource($cart);
    }

    public function destroy(Request $request, Cart $cart, $item_id)
    {
        CartItem::findorfail($item_id)->delete();

        
        $ShippingFee = $this->cartService->calculateShippingFees($cart);

        (new Discount())->clearDiscount($cart->items()->get(), 'coupons');

        $CartTotal   = $this->cartService->CartProductTotal($cart);

    
        $cart->subtotal      = ($CartTotal );
        $cart->shipping_fees = $ShippingFee;
        $cart->total         = ($CartTotal+$ShippingFee);
        $cart->save();
        return $this->index($request);
    }

}
