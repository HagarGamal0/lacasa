<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Exports\AbandonedOrdersExport;
use App\Exports\oldAbandonedOrdersExport;
use App\Exports\FinanceExport;
use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Sales\Cart\CartItem;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ExportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function exportActive(Request $request)
    {
        // $filters = $request['find'];
        $request->validate([
            // 'find.created_after' => 'required|date_format:Y-m-d|before:created_before',
            // 'find.created_before' => 'required|date_format:Y-m-d|after:created_after',
            'find.vendor_id' => 'nullable|exists:users,id',
        ]);
        if (\Auth::user()->is_vendor()) {
            $request->merge(['find' => collect($request['find'])->merge(['vendor_id' => \Auth::id()])]);
            // return $request;
        }
        $orders = QueryBuilder::for(CartItem::with(['cart.order', 'product']))
            ->allowedFilters([
                AllowedFilter::Exact('id'),
                AllowedFilter::Exact('type', 'cart.status')->default('Order'),
                AllowedFilter::Exact('status'),
                AllowedFilter::Exact('payment_id', 'cart.orderable.payment_id'),
                AllowedFilter::Exact('payment_order_id', 'cart.order.payment_order_id'),
                AllowedFilter::Exact('vendor_id', 'product.vendor_id'),
                AllowedFilter::Exact('vendor_name', 'product.vendor.vendor.name'),
                AllowedFilter::Exact('product.name'),
                // 'cart.order.status',
                AllowedFilter::Exact('payment_status'),
                AllowedFilter::Exact('payment_method.name', 'cart.order.payment_method.name'),
                AllowedFilter::Exact('payment_method.id', 'cart.order.payment_method.id'),
                AllowedFilter::Exact('user.id', 'cart.orderable.user.id'),
                AllowedFilter::Exact('user.phone', 'cart.orderable.user.phone'),
                // AllowedFilter::scope('is_valid'),
                AllowedFilter::scope('created_before', 'cart.orderable.created_before'),
                AllowedFilter::scope('created_after', 'cart.orderable.created_after'),
            ])
            ->defaultSort('-id')
        // ->orderBy('cart.order.id')
            ->get()->sortByDesc(fn ($item, $key) => $item->cart->orderable->id);

        return Excel::download(new OrdersExport($orders), 'orders - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportAbandoned(Request $request)
    {
        $filters = $request['find'];

        return Excel::download(new AbandonedOrdersExport($filters), 'orders - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportOldAbandoned(Request $request)
    {
        $filters = $request['find'];

        return Excel::download(new oldAbandonedOrdersExport($filters), 'old_abandoned_orders - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }


    public function statement(Request $request)
    {
        $request->validate([
            'find.created_after' => 'required|date_format:Y-m-d|before:created_before',
            'find.created_before' => 'required|date_format:Y-m-d|after:created_after',
            'find.vendor_id' => 'nullable|exists:users,id',
        ]);
        if (\Auth::user()->is_vendor()) {
            $request->merge(['find' => collect($request['find'])->merge(['vendor_id' => \Auth::id()])]);
        }

        $cart_items = QueryBuilder::for(CartItem::with(['cart', 'cart.orderable.user', 'product.shipping_profile.provider', 'product.vendor.vendor']))
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
                'order_id' => $item['cart']['orderable_id'],
                'vendor' => $item['product']['vendor']['vendor']['company_name'],
                'account_manager' => $item->product->vendor->account_manager?->name,
                'product' => [
                    'id' => $item['product_id'],
                    'name' => $item['product']['name'],
                    'slug' => $item['product']['slug'],
                    'shipped_by' => $item['product']['shipping_profile']['provider']['name'],
                ],
                'customer' => collect($item->cart->orderable->user)->only('id', 'name'),
                'date' => $item->cart->order->created_at->format('d, M Y'),
                'payment_method' => $item->cart->order->payment_method->display_name,
                'shipping_status' => $item['status'],
                'shipping_fees' => $item['shipping_fees'],
                'commission_percentage' => $item['product']['vendor']['vendor']['commission'],
                'commission' => $item['commission'],
                'total_discounts' => $item['total_discounts'],
                'vendor_revenue' => $item['vendor_revenue'],
                'subtotal' => $item['subtotal'],
                'total' => $item['total'],
                'to_be_transferred_to_lacasa' => 'Cash On Delivery' === $item->cart->order->payment_method->display_name ? $item['commission'] : 0,
                'to_be_transferred_to_vendor' => 'Cash On Delivery' === $item->cart->order->payment_method->display_name ? 0 : $item['vendor_revenue'],
                'is_complete' => $item['is_cleared'] ? 'Paid' : 'Pending',
            ];
        });

        return Excel::download(new FinanceExport($equation), 'Financial Sheet - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
