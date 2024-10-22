<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Helpers\PaginatorHelper;
use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Order\Order;
use Auth;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class StatementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $request->validate([
            'find.created_after' => 'required|date_format:Y-m-d|before:created_before',
            'find.created_before' => 'required|date_format:Y-m-d|after:created_after',
            'find.vendor_id' => 'nullable|exists:users,id',
        ]);
        if (Auth::user()->is_vendor()) {
            $request->merge(['find' => collect($request['find'])->merge(['vendor_id' => Auth::id()])]);
        }
        $cart_items = QueryBuilder::for(CartItem::class)
        ->allowedFilters([
            AllowedFilter::Exact('id'),
            AllowedFilter::Exact('type', 'cart.status')->default('Order'),
            AllowedFilter::Exact('status'),
            AllowedFilter::Exact('payment_id', 'cart.order.payment_id'),
            AllowedFilter::Exact('payment_order_id', 'cart.order.payment_order_id'),
            AllowedFilter::Exact('vendor_name', 'product.vendor.vendor.name'),
            AllowedFilter::Exact('product.name'),
            // 'cart.order.status',
            AllowedFilter::Exact('payment_status'),
            AllowedFilter::Exact('payment_method.name', 'cart.order.payment_method.name'),
            AllowedFilter::Exact('payment_method.id', 'cart.order.payment_method.id'),
            AllowedFilter::Exact('user.id', 'cart.order.user.id'),
            AllowedFilter::Exact('user.phone', 'cart.order.user.phone'),
            // AllowedFilter::scope('is_valid'),
            AllowedFilter::scope('created_before', 'cart.order.created_before'),
            AllowedFilter::scope('created_after', 'cart.order.created_after'),
            AllowedFilter::Exact('vendor_id', 'product.vendor.vendor.id'),
        ])
        ->defaultSort('-id')
        ->get();

        $equation = $cart_items->map(function ($item) {
            // $payment = PaymentMethod::find($orders->first()->order->payment_method_id)->first();
            return [
                'order_id' => $item['cart']['order']['id'],
                'product' => [
                    'id' => $item['product_id'],
                    'name' => $item['product']['name'],
                    'slug' => $item['product']['slug'],
                ],
                'date' => $item->cart->order->created_at->format('d, M Y'),
                'payment_method' => $item->cart->order->payment_method->display_name,
                'shipping_status' => $item['status'],
                'commission' => $item['commission'],
                'vendor_revenue' => $item['vendor_revenue'],
                'subtotal' => $item['subtotal'],
                'to_be_transferred_to_lacasa' => $item->cart->order->payment_method->display_name == 'Cash On Delivery' ? $item['commission'] : 0,
                'to_be_transferred_to_vendor' => $item->cart->order->payment_method->display_name == 'Cash On Delivery' ? 0 : $item['vendor_revenue'],
                'is_complete' => $item['is_cleared'] ? 'Paid' : 'Pending',
            ];
        });
  //
        // return $equation;
        return [
            'data' => [
                'statement' => PaginatorHelper::paginate($equation, 30),
                'calculation' => [
                    'total_vendor_income' => $equation->sum('vendor_revenue'),
                    'total_lacasa_income' => $equation->sum('commission'),
                    'to_be_transferred_to_lacasa' => $equation->where('payment_method', 'Cash On Delivery')->where('is_complete', 'Pending')->sum('commission'),
                    'to_be_transferred_to_vendor' => $equation->where('payment_method', '!=', 'Cash On Delivery')->where('is_complete', 'Pending')->sum('vendor_revenue'),
                ],
                'account_manager' => Auth::user()->vendor->account_manager ? [
                    'id' => Auth::user()->vendor->account_manager?->id,
                    'name' => Auth::user()->vendor->account_manager?->name,
                    'phone' => Auth::user()->vendor->account_manager?->phone,
                    'email' => Auth::user()->vendor->account_manager?->email,
                    'commission' => Auth::user()->vendor->commission,
                ] : null,
                'applied_filters' => $request->all(),
            ],
        ];
    }

    public function calculate($request_data)
    {
        if (empty($request_data['from_date'])) {
            $request_data['from_date'] = Carbon::now()->startOfMonth()->format('Y-m-d H:i:s');
            $request_data['to_date'] = Carbon::now()->endOfMonth()->format('Y-m-d H:i:s');
        }
        if (Auth::user()->is_vendor()) {
            $vendor_id = Auth::id();
        } else {
            if (empty($request_data['vendor_id'])) {
                throw ValidationException::withMessages(['vendor_id' => 'vendor_id is required']);
            }
            $vendor_id = $request_data['vendor_id'];
        }
        $vendor_orders = OrderProduct::whereStatus('Delivered')->with('product')->whereHas('product', function (Builder $query) use ($vendor_id) {
            $query->where('vendor_id', $vendor_id);
        })->whereHas('order', function (Builder $query) use ($request_data) {
            $query->whereStatus('Complete')->whereBetween('created_at', [$request_data['from_date'], $request_data['to_date']]);
        })->get();
        // return $vendor_orders;
        // return $vendor_orders->first()->order->payment_method_id;
        $equation = $vendor_orders->map(function ($item) use ($vendor_orders) {
            $payment = PaymentMethod::find($vendor_orders->first()->order->payment_method_id)->first();

            return [
                'order_id' => $item['order_id'],
                'product' => [
                    'id' => $item['product_id'],
                    'name' => $item['product']['name'],
                    'slug' => $item['product']['slug'],
                ],
                'date' => $vendor_orders->first()->order->created_at->format('d, M Y'),
                'payment_method' => $payment->display_name,
                'shipping_status' => $item['status'],
                'commission' => $item['commission'],
                'vendor_revenue' => $item['vendor_revenue'],
                'subtotal' => $item['subtotal'],
                'to_be_transferred_to_lacasa' => $payment->display_name == 'Cash On Delivery' ? $item['commission'] : 0,
                'to_be_transferred_to_vendor' => $payment->display_name == 'Cash On Delivery' ? 0 : $item['vendor_revenue'],
                'is_complete' => $item['financed'] ? 'Paid' : 'Pending',
            ];
        });

        return $equation;
    }
}
