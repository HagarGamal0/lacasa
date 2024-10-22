<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrder;
use App\Http\Requests\Order\UpdateCart;
use App\Http\Requests\Order\ValidateCartItems;
use App\Http\Resources\Order\OldOrder as OrderResource;
use App\Http\Services\Orders\InitializeCart;
use App\Http\Services\Orders\ManageOrder;
use App\Http\Services\Orders\Paymob;
use App\Models\PaymentMethod;
use App\Models\Sales\Order\OldOrder;
use Illuminate\Http\Request;
use Log;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OldOrdersExport;

class OldOrderController extends Controller
{
    public function __construct()
    {
        // $this->middleware(['role:super-admin','permission:publish articles|edit articles']);
        // $this->middleware(['auth:sanctum'])->only(['index', 'update']);
        // $this->middleware(['can:View Orders'])->only('index');
        // ->only(['update', 'store']);
        // $this->middleware(['auth:sanctum', 'permission:Update Orders'])->only('update');
    }

    public function index()
    {
        return OrderResource::collection(QueryBuilder::for(OldOrder::class)
                ->allowedFilters([
                    AllowedFilter::Exact('id'),
                    'status',
                    'payment_id',
                    AllowedFilter::Exact('payment_status'),
                    'payment_method.name',
                    'user.name',
                    'user.id',
                    'user.phone',
                    AllowedFilter::scope('is_valid'),
                    AllowedFilter::scope('created_before'),
                    AllowedFilter::scope('created_after'),
                    AllowedFilter::scope('total_from'),
                    AllowedFilter::scope('total_to'),
                    AllowedFilter::scope('vendor.name', 'vendor_filter'),
                    AllowedFilter::scope('product.name', 'product_filter'),
                ])
                ->defaultSort('-id')
                ->paginate(24));
    }

    public function show($id)
    {
        return new OrderResource(OldOrder::with('activities')->find($id));
    }

    public function store(CreateOrder $request)
    {
        $order = $request->validated();
        Log::channel('create_order')->info('NEW REQUEST:');
        Log::channel('create_order')->info($request);
        $cart = (new InitializeCart)->init($order, $request);
        Log::channel('create_order')->info('INTIALIZE CART:');
        Log::channel('create_order')->info($cart);
        $order = (new ManageOrder)->createTemp($cart, $request);
        Log::channel('create_order')->info('TEMP ORDER:');
        Log::channel('create_order')->info($order);

        if (PaymentMethod::find($request->validated()['payment_method'])->name != 'cod') {
            $token = (new Paymob)->generateToken($order);
        } else {
            $token = null;
            // return $order;
            $order = (new ManageOrder)->releaseTemp($order);
            Log::channel('create_order')->info('COD ORDER:');
            Log::channel('create_order')->info($order);
            $order->update(['payment_status' => 'Cash On Delivery']);
        }
        Log::channel('create_order')->info($order);

        return [
            'data' => [
                'order' => new OrderResource($order),
                'payment_action' => [
                    'iframe_id' => PaymentMethod::find($request->validated()['payment_method'])->iframe_id,
                    'token' => $token,
                ],
            ],
        ];

        return new OrderResource($order);
    }

    public function updateCart(UpdateCart $request)
    {
        $order = $request->validated();
        $cart = (new InitializeCart)->init($order, $request);

        return [
            'products' => $cart['products'],
            'original_subtotal' => collect($cart['products'])->sum('original_subtotal'),
            'original_shipping' => collect($cart['products'])->sum('original_shipping_fees'),
            'flash_sale_discount' => collect($cart['products'])->sum('flash_sale_discount'),
            'coupon_discount' => collect($cart['products'])->sum('coupon_discount'),
            'payment_method_discount' => collect($cart['products'])->sum('payment_method_discount'),
            'coupon_id' => isset(collect($cart['products'])->whereNotNull('coupon_id')->first()['coupon_id']) ? collect($cart['products'])->whereNotNull('coupon_id')->first()['coupon_id'] : null,
            'total_discounts' => collect($cart['products'])->sum('shipping_discount') + collect($cart['products'])->sum('flash_sale_discount') + collect($cart['products'])->sum('payment_method_discount') + collect($cart['products'])->sum('coupon_discount') + $cart['orange_voucher']['voucher_discount'],
            'subtotal' => collect($cart['products'])->sum('subtotal'),
            'shipping_discount' => collect($cart['products'])->sum('shipping_discount'),
            'shipping_fees' => collect($cart['products'])->sum('shipping_fees'),
            'orange_discount' => $cart['orange_voucher']['voucher_discount'],
            'total' => collect($cart['products'])->sum('total') - $cart['orange_voucher']['voucher_discount'],
            'address_id' => $cart['address']->id,
        ];
    }

    public function validateCart(ValidateCartItems $cart)
    {
        return (new InitializeCart)->validateProducts($cart['products']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'down_payment' => 'string|required',
        ]);
        Order::find($id)->update(['down_payment' => $request['down_payment']]);

        return new OrderResource(Order::find($id));
    }
    
    
    
    public function exportActive(Request $request)
    {
      $filters = $request['find'];
      return Excel::download(new OldOrdersExport($filters), 'Old_orders - '.now().'.csv',  \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
      ]);
    }
}
