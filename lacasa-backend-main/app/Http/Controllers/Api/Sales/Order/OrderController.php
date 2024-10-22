<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ShippingIntegrations\Sprint;
use App\Http\Requests\CalculateOrderRequest;
use App\Http\Resources\Order\Cart\Cart as CartResource;
use App\Http\Resources\Order\DraftOrder as DraftOrderResource;
use App\Http\Resources\Order\Order as OrderResource;
use App\Http\Services\Orders\CartService;
use App\Http\Services\Orders\Discount;
use App\Http\Services\Orders\ManageOrder;
use App\Http\Services\Orders\Paymob;
use App\Models\PaymentMethod;
use App\Models\Sales\Cart\Cart;
use App\Models\Sales\Order\DraftOrder;
use App\Models\Sales\Order\Order;
use App\Models\Sales\Offer\Coupon;
use App\Models\Sales\Shipping\Shipment;
use App\Models\Sales\Shipping\ShippingProvider;
use App\Traits\GeneralResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Str;
use App\Enums\EmailBlocked;
use App\Enums\PhoneBlocked;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public $cartService;

    public function __construct(CartService $cartService)
    {
        $this->middleware(['auth:sanctum', 'verified'])->only('update');

        $this->cartService = $cartService;
    }

    public function index()
    {
        return OrderResource::collection(QueryBuilder::for(Order::class)
            ->with('activities')
            ->allowedFilters([
                AllowedFilter::Exact('id'),
                'status',
                AllowedFilter::Exact('products.status', 'cart.items.status'),
                'payment_id',
                AllowedFilter::Exact('vendor_id', 'cart.items.product.vendor_id'),
                AllowedFilter::Exact('payment_status'),
                'payment_method.name',
                AllowedFilter::Exact('payment_method.id'),
                AllowedFilter::Exact('payment_order_id'),
                'user.name',
                'user.id',
                'user.phone',
                AllowedFilter::Exact('user.id'),
                AllowedFilter::Exact('user.phone'),
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after'),
                AllowedFilter::Exact('show_in_secondary'),
                // AllowedFilter::scope('total_from'),
                // AllowedFilter::scope('total_to'),
            ])
            ->defaultSort('-id')
            ->paginate(24));
    }

    public function show($id)
    {
        return new OrderResource(Order::with('activities')->find($id));
    }

    public function calculate(request $request, Cart $cart, $purchase = false)
    {
        $order = $request->validate([
            'address' => 'required|array',
            'address.id' => 'integer|required_without:address|exists:address_books,id',
            'address.first_name' => 'required_without:address.id|string',
            'address.last_name' => 'required_without:address.id|string',
            'address.phone' => [
                'required_without:address.id',
                'digits:11',
                Rule::notIn(PhoneBlocked::getPhone())
            ],
            'address.email' => [
                'required_without:address.id',
                'email',
                Rule::notIn(EmailBlocked::getEmail())
            ],
            // 'address.address' => 'required_without:address.id|string',
            'address.area_id' => 'required_without:address.id|exists:areas,id',
            'address.type' => 'required_without:address.id|in:shipping,billing',
            'address.default' => 'required_without:address.id|boolean',
            'address.street' => 'required_without:address.id|string',
            'address.apartment_no' => 'required_without:address.id|string',
            'address.building_no' => 'required_without:address.id|string',
            'address.floor_no' => 'required_without:address.id|string',
            // order info
            'payment_method' => 'integer|required|exists:payment_methods,id',
            'wallet_number' => [
                'required_if:payment_method,' . DB::table('payment_methods')->where('name', 'wallet')->value('id'),
                'digits:11',
            ],
            // discounts
            'coupon' => 'nullable|exists:coupons,coupon_code',
            'voucher_id' => 'nullable|exists:orange_vouchers,id',
            'notes' => 'string|nullable',
        ], [
            'address.required' => __('validation.required', ['attribute' => __('lang.address.address')]),

            'address.id.integer' => __('validation.integer', ['attribute' => __('lang.address.id')]),
            'address.id.required_without' => __('validation.required_without', ['attribute' => __('lang.address.id'), 'values' => __('lang.address.address')]),
            'address.id.exists' => __('validation.exists', ['attribute' => __('lang.address.id')]),

            'address.first_name.string' => __('validation.integer', ['attribute' => __('lang.address.first_name')]),
            'address.first_name.required_without' => __('validation.required_without', ['attribute' => __('lang.address.first_name'), 'values' => __('lang.address.address')]),

            'address.last_name.string' => __('validation.integer', ['attribute' => __('lang.last_name')]),
            'address.last_name.required_without' => __('validation.required_without', ['attribute' => __('lang.last_name'), 'values' => __('lang.address.address')]),

            'address.phone.string' => __('validation.digits', ['attribute' => __('lang.phone'), 'digits' => 11]),
            'address.phone.required_without' => __('validation.required_without', ['attribute' => __('lang.phone'), 'values' => __('lang.address.address')]),

            'address.email.email' => __('validation.email', ['attribute' => __('lang.email')]),
            'address.email.required_without' => __('validation.required_without', ['attribute' => __('lang.email'), 'values' => __('lang.address.address')]),
            'address.email.not_in' => __('validation.email_is_blocked', ['attribute' => $request->address['email'] ?? ""]),

            'address.area_id.exists' => __('validation.exists', ['attribute' => __('lang.area_id')]),
            'address.area_id.required_without' => __('validation.required_without', ['attribute' => __('lang.area_id'), 'values' => __('lang.address.address')]),

            'address.type.exists' => __('validation.in', ['attribute' => __('lang.type')]),
            'address.type.required_without' => __('validation.required_without', ['attribute' => __('lang.type'), 'values' => __('lang.address.address')]),

            'address.default.boolean' => __('validation.boolean', ['attribute' => __('lang.default')]),
            'address.default.required_without' => __('validation.required_without', ['attribute' => __('lang.default'), 'values' => __('lang.address.address')]),

            'address.street.string' => __('validation.string', ['attribute' => __('lang.street')]),
            'address.street.required_without' => __('validation.required_without', ['attribute' => __('lang.street'), 'values' => __('lang.address.address')]),

            'address.apartment_no.string' => __('validation.string', ['attribute' => __('lang.apartment_no')]),
            'address.apartment_no.required_without' => __('validation.required_without', ['attribute' => __('lang.apartment_no'), 'values' => __('lang.address.address')]),

            'address.building_no.string' => __('validation.string', ['attribute' => __('lang.building_no')]),
            'address.building_no.required_without' => __('validation.required_without', ['attribute' => __('lang.building_no'), 'values' => __('lang.address.address')]),

            'address.floor_no.string' => __('validation.string', ['attribute' => __('lang.floor_no')]),
            'address.floor_no.required_without' => __('validation.required_without', ['attribute' => __('lang.floor_no'), 'values' => __('lang.address.address')]),

            'payment_method.integer' => __('validation.integer', ['attribute' => __('lang.payment_method')]),
            'payment_method.required' => __('validation.required', ['attribute' => __('lang.payment_method')]),
            'payment_method.exists' => __('validation.exists', ['attribute' => __('lang.payment_method')]),

            'wallet_number.required_if' => __('validation.required_if', ['attribute' => __('lang.wallet_number'), 'other' => __('lang.payment_method'), 'value' => '']),
            'wallet_number.digits' => __('validation.digits', ['attribute' => __('lang.wallet_number'), 'digits' => __('lang.payment_method')]),


            'coupon.exists' => __('validation.exists', ['attribute' => __('lang.coupon')]),
            'voucher_id.exists' => __('validation.exists', ['attribute' => __('lang.voucher_id')]),
            'notes.string' => __('validation.string', ['attribute' => __('lang.notes')]),

        ]);

        // Validate Products
        if (!$cart->items->count()) {
            throw ValidationException::withMessages([
                'products' => __('lang.Cart_Cannot_be_empty'),
            ]);
        }

        $address = $this->cartService->validateAddress($order, $cart);
        if (!isset($address->id)) {
            return $address;
        }
        // Validate Items Shipping Fees;
        $products = $cart->items()->get();

        // Apply Discounts
        if (isset($order['coupon']) && $order['coupon'] && (in_array($order['payment_method'], PaymentMethod::ShippingPayment))) {
            $couponStr = Str::lower($order['coupon']);
            if ($couponStr == Str::lower(Coupon::FreeShippingCode)) {
                (new Discount())->freeShippingCoupons($products, $couponStr, $address);
            } elseif ($order['payment_method'] == PaymentMethod::DebitCard && $couponStr == Str::lower(Coupon::DC50Code)) {
                (new Discount())->coupons($products, $couponStr, $address);
            } elseif ($order['payment_method'] == PaymentMethod::CashOnDelivery && $couponStr == Str::lower(Coupon::LC3Code)) {
                (new Discount())->coupons($products, $couponStr, $address);
            } elseif ($order['payment_method'] == PaymentMethod::VALU && $couponStr == Str::lower(Coupon::VALIU35Code)) {
                (new Discount())->coupons($products, $couponStr, $address);
            } elseif ($couponStr != Str::lower(Coupon::DC50Code) && $couponStr != Str::lower(Coupon::LC3Code) && $couponStr != Str::lower(Coupon::VALIU35Code) && (in_array($order['payment_method'], PaymentMethod::globalPayment))) {
                (new Discount())->coupons($products, $couponStr, $address);
            } else {
                (new Discount())->clearDiscount($products, 'coupons');
            }
        } else {
            (new Discount())->clearDiscount($products, 'coupons');
        }


        if (isset($order['voucher_id']) && $order['voucher_id']) {
            (new Discount())->orange($products, $order['voucher_id']);
        } else {
            (new Discount())->clearDiscount($products, 'orange_discount');
        }

        $responce = $this->cartService->updateSheppingFeesForCart($cart);

        (new Discount())->applyPaymentMethodDiscount($products, $order['payment_method']);

        if ($responce != 1) {
            return GeneralResponse::responseMessage($responce['message'], $responce['message'], 400, null, $responce['errors']);
        }
        if (!$purchase) {
            return new CartResource($cart->fresh());
        }

        foreach ($cart->items as $item) {
            $item->update([
                'vendor_revenue' => $item->vendor_revenue,
                'commission' => $item->commission,
            ]);
        }
        $data = new \stdClass();
        $data->cart = $cart->fresh();
        $data->address = $address;
        $data->payment = PaymentMethod::find($order['payment_method']);

        return $data;
    }

    public function store(Request $request, Cart $cart)
    {
        $order = $this->calculate($request, $cart, $purchase = true);
        dd($request->all());
        $type = 'cod' === $order->payment->name ? 'Order' : 'DraftOrder';
        $order = $this->createOrder($type, $order);
        $order->update(['notes' => $request['notes']]);
        $order->update(['referral' => $request['referral']]);
        if ('cod' !== $order->payment_method->name) {
            $iframe_id = PaymentMethod::find($request['payment_method'])->iframe_id;
            $token = (new Paymob())->generateToken($order);
            if ('wallet' === $order->payment_method->name) {
                $iframe_url = (new Paymob())->walletPay($token->token, $request['wallet_number']);
            } else {
                $iframe_url = "https://accept.paymob.com/api/acceptance/iframes/{$iframe_id}?payment_token={$token->token}";
            }
        }
        if ($type === 'Order') {
            $this->cartService->updateProductsStock($cart->items);
        }
        return [
            'data' => [
                'order' => 'order' === \get_class($order) ? new OrderResource($order) : new DraftOrderResource($order),
                'payment_action' => 'DraftOrder' === $type ? [
                    'iframe_id' => $order->payment_method->iframe_id,
                    'token' => $token,
                    'iframe_url' => $iframe_url,
                ] : null,
            ],
        ];
    }

    public function createOrder($type, $order)
    {
        // return $order;
        $newOrder = 'DraftOrder' === $type ? new DraftOrder() : new Order();
        $newOrder->cart_id = $order->cart->id;
        $newOrder->notes = $order->cart->notes;
        $newOrder->payment_method_id = $order->payment->id;
        $newOrder->address_book_id = $order->address->id;
        $newOrder->user_id = $order->address->user->id;
        $newOrder->commission = 0;
        $newOrder->vendor_revenue = 0;
        $newOrder->payment_status = 'cod' === $order->payment->name ? 'Paid' : 'Unpaid';
        $newOrder->save();
        $order->cart->update([
            'status' => $type,
            'orderable_type' => \get_class($newOrder),
            'orderable_id' => $newOrder->id,
        ]);

        return $newOrder->fresh();
    }

    public function update(Request $request, Order $order)
    {
        if ($request['down_payment']) {
            $downValidate = $request->validate(
                ['down_payment' => 'numeric|between:0,9999999999.99|required']
                ,
                [
                    'down_payment.numeric' => __('validation.numeric', ['attribute' => __('lang.down_payment')]),
                    'down_payment.required' => __('validation.required', ['attribute' => __('lang.down_payment')]),
                    'down_payment.between' => __('validation.between.numeric', ['attribute' => __('lang.down_payment'), 'min' => '0', 'max' => '9999999999.99']),
                ]
            );
            $order->update(['down_payment' => $downValidate['down_payment']]);
        } else {
            if ('Shipped' !== $request['status']) {
                $validate = $request->validate([
                    'products' => 'required|array',
                    'products.*' => 'exists:cart_items,id,cart_id,' . $order->cart_id,
                    'status' => 'string|required|in:Pending Payment,Customer Confirmed,Processing,Ready To Ship,Rejected,Returned,Refunded',
                    'notes' => 'nullable|string',
                ],
                    [
                        'products.required' => __('validation.required', ['attribute' => __('lang.products')]),
                        'products.array' => __('validation.array', ['attribute' => __('lang.products')]),
                        'products.*' => __('validation.exists', ['attribute' => __('lang.products')]),
                        'status.string' => __('validation.string', ['attribute' => __('lang.status')]),
                        'status.required' => __('validation.required', ['attribute' => __('lang.status')]),
                        'status.in' => __('validation.in', ['attribute' => __('lang.status')]),
                        'notes.string' => __('validation.string', ['attribute' => __('lang.notes')]),
                    ]
                );
                if (\Str::contains($validate['status'], ['Rejected', 'Returned', 'Refunded'])) {
                    $products = $order->cart->items()->whereIn('id', $validate['products']);
                } else {
                    $products = $order->cart->items()->whereDoesntHave('shipment')->whereIn('id', $validate['products']);
                }
                foreach ($products->get() as $product) {
                    // return 'here';
                    $product->update(['status' => $validate['status']]);
                    $product->status_history()->create([
                        'order_id' => $order->id,
                        'order_product_id' => $product->id,
                        'status' => $validate['status'],
                        'user_id' => \Auth::id(),
                        'notes' => $validate['notes'] ?? null,
                    ]);
                }
            } else {
                $validate = $request->validate([
                    'status' => 'string|required|in:Shipped',
                ],
                    [
                        'status.string' => __('validation.string', ['attribute' => __('lang.status')]),
                        'status.required' => __('validation.required', ['attribute' => __('lang.status')]),
                        'status.in' => __('validation.in', ['attribute' => __('lang.status')]),
                    ]
                );
                $products = $order->cart->items()->whereStatus('Ready To Ship');
                $shipments = $products->whereDoesntHave('shipment')->get()->groupBy('product.shipping_profile.shipping_provider_id');
                foreach ($shipments as $key => $shipment) {
                    $prepareShipment = new \stdClass();
                    $prepareShipment->provider = ShippingProvider::find($key);
                    $prepareShipment->products = $shipment->pluck('id');

                    $shipment = $order->shipments()->create([
                        'shipping_provider_id' => $prepareShipment->provider->id,
                        'airway_bill' => null,
                        'pickup_date' => null,
                        'pickup_ref' => null,
                    ]);
                    $order->cart->items()->whereIn('id', $prepareShipment->products)->update([
                        'shipment_id' => $shipment->id,
                        'status' => $validate['status'],
                    ]);
                    if ('sprint' === $prepareShipment->provider->key && null === $shipment->pickup_date) {
                        Sprint::createSprintShipment($shipment);
                    }
                }
            }
        }
        (new ManageOrder())->updateStatus($order);

        return $this->show($order->id);
    }

    public function updateShipment(Request $request, Order $order, Shipment $shipment)
    {
        $validate = $request->validate([
            'status' => 'string|required|in:Shipped,Arrived,Failed To Deliver',
        ],
            [
                'status.string' => __('validation.string', ['attribute' => __('lang.status')]),
                'status.required' => __('validation.required', ['attribute' => __('lang.status')]),
                'status.in' => __('validation.in', ['attribute' => __('lang.status')]),
            ]
        );
        if ('Shipped' === $validate['status']) {
            $shipment->update([
                'airway_bill' => null,
                'pickup_date' => null,
                'pickup_ref' => null,
            ]);
            // Add Ready Products to same shipment if same provider
            $products = $order->cart->items()->whereStatus('Ready To Ship');
            $newProducts = $products->whereDoesntHave('shipment')->get()->where('product.shipping_profile.shipping_provider_id', $shipment->shipping_provider_id);
            $products = $order->cart->items()->whereIn('id', $shipment->items->merge($newProducts)->pluck('id'));
            if ('sprint' === $shipment->shipping_provider->name && null === $shipment->pickup_date) {
                Sprint::createSprintShipment($shipment);
            }
        } else {
            $products = $shipment->items();
        }
        $products->update(['status' => $validate['status'], 'shipment_id' => $shipment->id]);
        (new ManageOrder())->updateStatus($order);

        return $this->show($order->id);
    }
}
