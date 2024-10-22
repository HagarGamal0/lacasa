<?php

namespace App\Http\Services\Orders;

use App\Models\Sales\Order\DraftOrder;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\Order\Order as OrderResource;

class Paymob
{

    protected $username;
    protected $password;

    public function __construct()
    {
        $this->username = config('paymob.username');
        $this->password = config('paymob.password');
    }

    public function generateToken(DraftOrder $order)
    {

        $orderedProducts = $this->prepareOrderedProducts($order->cart->items);
        $token = $this->getToken();
        if ($order->payment_order_id) {
            $paymentOrderId = $order->payment_order_id;
        } else {
            $paymobOrder = $this->createPaymobOrder($token, $order->id, $order->cart->payment, $orderedProducts);

            if (isset($paymobOrder['id'])) {
                $order->update(['payment_order_id' => $paymobOrder['id']]);
                $paymentOrderId = $paymobOrder['id'];
            } else {
                throw ValidationException::withMessages([
                    'paymob' => __('lang.Could not communicate'),
                ]);
            }
        }

        return $response = $this->createPaymentKeys($token, $order->cart->payment, $order->id, $paymentOrderId, $orderedProducts, $order->address, $order->payment_method->integration_id);

        // return json_decode($response);
    }

    public function walletPay($token, $phone)
    {
        $pay = Http::post('https://accept.paymobsolutions.com/api/acceptance/payments/pay', [
            'source' => [
                'identifier' => $phone,
                'subtype' => 'WALLET',
            ],
            'payment_token' => $token,
        ]);

        $payment = $pay->json();
        if (! isset($payment['redirect_url'])) {
            throw ValidationException::withMessages([
                'paymob' => __('lang.Could not communicate'),
            ]);
        }

        return $payment['redirect_url'];
    }

    private function prepareOrderedProducts($items)
    {
        $orderedProducts = [];

        foreach ($items as $item) {
            $productDetails = $item->product;
            $orderedProducts[] = [
                'name' => $productDetails->name,
                'amount_cents' => $item->total * 100,
                'description' => strip_tags($productDetails->description),
                'quantity' => $item->quantity,
            ];
        }

        return $orderedProducts;
    }

    private function getToken()
    {
        $response = Http::post('https://accept.paymobsolutions.com/api/auth/tokens', [
            'username' => $this->username,
            'password' => $this->password,
        ]);

        return json_decode($response)->token;
    }

    private function createPaymobOrder($token, $orderId, $totalAmount, $orderedProducts)
    {
        $prepare = Http::post('https://accept.paymobsolutions.com/api/ecommerce/orders', [
            'auth_token' => $token,
            'delivery_needed' => 'false',
            // 'merchant_order_id' => $orderId,
            'amount_cents' => $totalAmount * 100,
            'currency' => 'EGP',
            // 'merchant_order_id' => $orderId,
            'items' => $orderedProducts,
        ]);

        return $prepare->json();
    }

    private function createPaymentKeys($token, $totalAmount, $orderId, $paymentOrderId, $orderedProducts, $address, $integrationId)
    {
        $response = Http::post('https://accept.paymobsolutions.com/api/acceptance/payment_keys?token=' . $token, [
            'auth_token' => $token,
            'amount_cents' => $totalAmount * 100,
            // 'merchant_order_id' => $orderId,
            'order_id' => $paymentOrderId,
            'currency' => 'EGP',
            // 'integration_id' => 3790092,
            'integration_id' => $integrationId,
            'items' => $orderedProducts,
            'shipping_data' => [
                'apartment' => $address->apartment ? $address->apartment : 'NA',
                'building' => $address->apartment ? $address->apartment : 'NA',
                'email' => $address->user->email,
                'floor' => $address->floor ? $address->floor : 'NA',
                'first_name' => $address->first_name,
                'street' => $address->address,
                'phone_number' => $address->phone,
                'city' => $address->area->city->name,
                'country' => 'Egypt',
                'state' => $address->area->name,
                'last_name' => $address->last_name,
                'postal_code' => '00000',
            ],
            'billing_data' => [
                'apartment' => $address->apartment ? $address->apartment : 'NA',
                'email' => $address->user->email,
                'floor' => $address->floor ? $address->floor : 'NA',
                'first_name' => $address->first_name,
                'street' => $address->address,
                'building' => $address->apartment ? $address->apartment : 'NA',
                'phone_number' => $address->phone,
                'shipping_method' => 'PKG',
                'postal_code' => '00000',
                'city' => $address->area->city->name,
                'country' => 'Egypt',
                'last_name' => $address->last_name,
                'state' => $address->area->name,
            ],
        ]);

        return json_decode($response);
    }
}
