<?php

namespace App\Http\Services\Orders;

use App\Enums\ShippingProfileType;
use App\Http\Resources\User\Vendor\ShippingFee;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Cart\Cart;
use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Shipping\ShippingProfileRule;
use App\Models\User\AddressBook;
use App\Models\User\User;
use Illuminate\Http\Response;
use App\Traits\GeneralResponse;
use Auth;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Api\User\AuthenticationController;

class CartService
{
    public function validateAddress($order, Cart $cart)
    {
        if (isset($order['address']['id'])) { //if address provided retrive address
            $address = AddressBook::find($order['address']['id']);
            $user    = $address->user;
        } else {
            $user_email = $order['address']['email'];
            if (AUth::guard('sanctum')->user()) {
                $user = AUth::guard('sanctum')->user();
            } else {
                $user = User::whereEmail($user_email)->first();
                if (!$user) {
                    $user = (new ValidateUser)->createUser($order);
                }
            }
            // if (!$user->hasVerifiedEmail()) {
            //     $auth = new AuthenticationController();
            //     return $auth->sendVerificationEmail($user,'order');
            // }
            // assign the address to the user
            $address = collect($order['address'])->except('address')->put('user_id', $user->id)->toArray();
            $address = AddressBook::updateOrcreate(collect($address)->except(['city_id'])->toArray());
        }

        $cart->update([
          'city_id' => $address->area->city->id,
        ]);

        return $address;
    }


    public function updateSheppingFeesForCart(Cart $cart){

        $products = $cart->items()->get()->toArray();

        foreach($products as $k => $product)
        {
          $responce = $this->updateSheppingFeesForitem($product,$cart);
          if($responce != 1){
            return $responce;
            break;
          }
        }
        $ShippingFee = $this->calculateShippingFees($cart);
        $CartTotal   = $this->CartProductTotal($cart);

        $cart->subtotal      = $CartTotal ;
        $cart->shipping_fees = $ShippingFee;
        $cart->total         = $CartTotal + $ShippingFee;
        $cart->save();

        return 1;
    }


    public function updateSheppingFeesForitem($product ,Cart $cart)
    {
        $shipping_fee = $this->checkShippingFeesForItem($cart,$product['product_id']);

        if(is_int($shipping_fee)){
            CartItem::updateOrCreate([
                'id'         => $product['id'],
            ], [
                'shipping_fees' => $shipping_fee,
            ]);
            return true;
        }else{
            return $shipping_fee;
        }

    }

    public function calculateShippingFees(Cart $cart):float
    {
       $heaveyShipping    = $this->getShipppingOfHeaveyProductsInCart($cart);

       $lightShipping     = $this->getShipppingOfLightProductsInCart($cart);

       $shippingFee       =  $heaveyShipping + $lightShipping;

        return $shippingFee ?? 0;
    }

    public function CartProductTotal(Cart $cart):float
    {
        $ProductTotalQuery =  CartItem::where('cart_id',$cart->id)->get();
        $ProductTotal      = $ProductTotalQuery->sum('sub_total');
        return $ProductTotal ?? 0;
    }

    public function checkShippingFeesForItem($cart,$itemId){
        if ($cart->city_id) {
            $shippingRule = ShippingProfileRule::select('shipping_profile_rules.id','shipping_profile_rules.shipping_fee','shipping_profile_rules.is_disabled')
                             ->join('shipping_profiles', 'shipping_profile_rules.shipping_profile_id', '=', 'shipping_profiles.id')
                             ->join('products','products.shipping_profile_id','=','shipping_profiles.id')
                             ->where('shipping_profile_rules.city_id',$cart->city_id)
                             ->where('products.id',$itemId)->first();
            $product = Product::find($itemId);
            if($shippingRule->is_disabled == 1){
                $data['message'] = __('lang.NotAvalibaleToshipping',['Product'=>$product->name,'city'=>$cart->city->City]);
                $data['data'] =
                [
                    'product_id'=> $itemId,
                    'product'   => $product->name,
                    'City'      => $cart->city->name,
                ];

                $data['errors'] =
                [
                    'message'=>    $data['message'],
                ];

                return $data;
            }else{
               $shipping_fee = $shippingRule->shipping_fee;
            }
         } else {
             $shipping_fee = 0;
         }
         return $shipping_fee;
    }


    protected function getShipppingOfHeaveyProductsInCart(Cart $cart){
        $shippingFees = CartItem::select(DB::raw('SUM(cart_items.shipping_fees*cart_items.quantity) AS shipping_fees'))
                            ->join('products','products.id','=','cart_items.product_id')
                            ->join('shipping_profiles','products.shipping_profile_id','=','shipping_profiles.id')
                            ->where('cart_items.cart_id',$cart->id)
                            ->where('shipping_profiles.type',ShippingProfileType::Heavey)
                            ->first()->shipping_fees;
            $this->totalSheepingFeesOfHeaveyProducts($cart->id);
        return floatval($shippingFees);
    }

    protected function getShipppingOfLightProductsInCart(Cart $cart){
        $cartItems = CartItem::select(DB::raw('shipping_profile_rules.shipping_fee,cart_items.product_id,cart_items.quantity,products.vendor_id'))
                            ->join('products','products.id','=','cart_items.product_id')
                            ->join('shipping_profiles','products.shipping_profile_id','=','shipping_profiles.id')
                            ->join('shipping_profile_rules','shipping_profile_rules.shipping_profile_id','=','shipping_profiles.id')
                            ->where('shipping_profile_rules.city_id',$cart->city_id)
                            ->where('cart_items.cart_id',$cart->id)
                            ->where('shipping_profiles.type',ShippingProfileType::Light)
                            ->Orderby('cart_items.shipping_fees','DESC')->get();
        $shippingFee      =  0;
        if($cartItems){
            $vendorProducts =[];
            foreach($cartItems as $item){
                $vendorProducts[$item['vendor_id']][]    = [
                    "cart_id"  => $cart->id,
                    "shipping_fees"  => $item['shipping_fee'],
                    "product_id"     => $item['product_id'],
                    "quantity"       => $item['quantity'],
                ];
            }
            $shippingFee = $this->calcSheppingForVendorProducts($vendorProducts);
        }

        return floatval($shippingFee);
    }


    protected function calcSheppingForVendorProducts(array $vendorProducts)
    {
        $shippingFee=0;
        foreach($vendorProducts as $vendorProduct)
        {
            $count = $this->getSumOfQuantityProducts($vendorProduct);
            $productLimit     = intval(ceil(($count/2)));
            $shippingFee += $this->getSheepingFeesOfProducts($vendorProduct,$productLimit);
        }
        return $shippingFee;
    }


    protected function getSumOfQuantityProducts(array $vendorProduct)
    {
        $quantitySum = 0;
        foreach($vendorProduct as $vProduct)
        {
            $quantitySum += $vProduct['quantity'];
        }
        return $quantitySum;
    }

    protected function getSheepingFeesOfProducts(array $vendorProduct ,int $productLimit)
    {
        $shippingFee = 0;
        foreach($vendorProduct as $vProduct)
        {
            $productFees = 0;
            if($productLimit > 0){
                if($vProduct['quantity'] <= $productLimit){
                    $productFees  = ($vProduct['quantity'] * $vProduct['shipping_fees']);
                    $shippingFee += $productFees;
                    $productLimit = $productLimit - $vProduct['quantity'];
                }else{
                    $productFees = ($productLimit * $vProduct['shipping_fees']);
                    $shippingFee += $productFees;
                    $productLimit = $productLimit- $vProduct['quantity'];
                }
            }
            CartItem::where(
                    [
                    ['cart_id','=',$vProduct['cart_id']],
                    ['product_id','=',$vProduct['product_id']]
                    ]
                )->update(
                [
                    'total_shipping_fees'=>$productFees
                ]
                );
        }
        return $shippingFee;
    }

    protected function totalSheepingFeesOfHeaveyProducts(int $cart_id)
    {
        CartItem::join('products','products.id','=','cart_items.product_id')
        ->join('shipping_profiles','products.shipping_profile_id','=','shipping_profiles.id')
        ->where('cart_items.cart_id',$cart_id)
        ->where('shipping_profiles.type',ShippingProfileType::Heavey)
        ->update([
            'total_shipping_fees' => DB::raw('cart_items.shipping_fees * cart_items.quantity')
        ]
        );
    }


    public function updateProductsStock($cartProducts)
    {
        foreach($cartProducts as $product){
            Product::where('id',$product['product_id'])->decrement('stock',$product['quantity']);
        }
    }




}
