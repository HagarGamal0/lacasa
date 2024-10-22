<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateOrder;
use App\Http\Requests\Order\UpdateProductOrder;
use App\Http\Resources\Cart\CartItem as OrderProductResource;
use App\Http\Resources\User\Vendor\Order as OrderResource;
use App\Mail\Admin\Order\Updated as AdminOrderUpdatedMail;
use App\Mail\User\Order\Updated as UserOrderUpdatedMail;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\OldOrder;
// use App\Http\Resources\User\Vendor\OrderProduct as OrderProductResource;
use App\Models\Sales\Order\Order;
use App\Models\Sales\Order\OrderProduct;
// use App\Http\Resources\Order\Order as OrderResource;
use App\Models\Sales\Order\OrderStatusHistory;
use App\Models\User\User;
use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Mail;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $request->validate([
            'find.created_after' => 'nullable|date_format:Y-m-d|before:created_before',
            'find.created_before' => 'nullable|date_format:Y-m-d|after:created_after',
            'find.vendor_id' => 'nullable|exists:users,id',
        ]);
        if (Auth::user()->is_vendor()) {
            $request->merge(['find' => collect($request['find'])->merge(['vendor_id' => Auth::id()])]);
            // return $request;
        }

        return OrderResource::collection(QueryBuilder::for(Order::whereHas('cart.items', function ($query) {
            $query->whereHas('product', function ($query) {
                $query->whereVendorId(Auth::id());
            });
        })
        ->with('cart.items', function ($query) {
            $query->whereHas('product', function ($query) {
                $query->whereVendorId(Auth::id());
            });
        })
        )->allowedFilters([
            AllowedFilter::Exact('id'),
            'status',
            AllowedFilter::Exact('products.status', 'cart.items.status'),
            'payment_id',
            AllowedFilter::Exact('payment_status'),
            AllowedFilter::Exact('vendor_id', 'cart.items.product.vendor_id'),
            'payment_method.name',
            AllowedFilter::Exact('payment_method.id'),
            AllowedFilter::Exact('payment_order_id'),
            'user.name',
            'user.id',
            'user.phone',
            AllowedFilter::Exact('user.id'),
            AllowedFilter::Exact('user.phone'),
            AllowedFilter::scope('created_before', 'created_before'),
            AllowedFilter::scope('created_after', 'created_after'),
        ])
              ->defaultSort('-id')
              ->paginate(24));
    }

    //
    //
    // public function show($id)
    // {
    //     return new OrderProductResource(OrderProduct::whereOrderId($id)->with('product')->whereHas('product', function (Builder $query) {
    //       $query->where('vendor_id', Auth::id());
    //     })->get());
    // }
    //

    //TEMP OLD ORDER UPDATE STATUS
    public function updateStatus($order_id, $product_id, UpdateOrder $request)
    {
        $order = $request->validated();
        $selected_order = OldOrder::findorfail($order_id);
        $old_status = $selected_order->status;
        $order_products = $selected_order->products();
        $product = Product::find($product_id);

        // Update Product Status
        $order_products->updateExistingPivot($product_id, ['status' => $order['status']]);
        // if($order['status'] != 'Cancelled' && empty($order['note']))
        // {
        //   $order['note'] = 'Status Updated by '.Auth::user()->name;
        // }
        // OrderStatusHistory::create([
        //     'user_id' => Auth::id(),
        //     'order_id' => $order_id,
        //     'order_product_id' => $order_products->where('product_id', $product_id)->first()->id,
        //     'status' => $order['status'],
        //     'notes' => isset($order['note']) && $order['note'] ? $order['note'] : null,
        // ]);
        // Mail::to('shop@lacasa-egy.com')->send(new AdminOrderUpdatedMail($selected_order, $selected_order->products()->find($product_id)));
        // Update Sales Count if Delivered
        if ($order['status'] == 'Delivered') {
            $product->update(['sales_count' => $product->sales_count + $order_products->find($product_id)->pivot->quantity]);
        }

        // Update Order status if processing
        if ($order['status'] == 'Processing') {
            $selected_order->update(['status' => 'Processing']);
        }
        // Update Order status if processing
        if ($order['status'] == 'Delivered' || $order['status'] == 'Cancelled') {
            $order_statuses = OrderProduct::whereOrderId($order_id)->get()->pluck('status');
            $order_statuses = $order_statuses->filter(function ($value, $key) {
                return $value == 'Delivered' || $value == 'Cancelled';
            })->values();
            // return $order_statuses;
            if ($order_statuses->count() == $selected_order->products()->count()) {
                OldOrder::find($order_id)->update(['status' => 'Complete']);
                if ($selected_order->payment_method->name == 'cod') {
                    OldOrder::find($order_id)->update(['payment_status' => 'Paid', 'payment_status_description' => 'Paid Upon Delivery']);
                }
            }
        }

        // Update Order Status if All Products are Delivered
        if ($selected_order->products()->wherePivot('status', 'Delivered')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Complete']);
            if ($selected_order->payment_method->name == 'cod') {
                OldOrder::find($order_id)->update(['payment_status' => 'Paid', 'payment_status_description' => 'Paid Upon Delivery']);
            }
        }
        // Update Order Status if All Products are Confirmed
        if ($selected_order->products()->wherePivot('status', 'Confirmed')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Confirmed']);
        }
        // Update Order Status if All Products are Confirmed
        if ($selected_order->products()->wherePivot('status', 'Pending payment')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Pending payment']);
        }
        // Update Order Status if All Products are Shipped
        if ($selected_order->products()->wherePivot('status', 'Shipped')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Shipped']);
        }
        // Update Order Status if All Products are Cancelled
        if ($selected_order->products()->wherePivot('status', 'Cancelled')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Cancelled']);
            if ($selected_order->payment_method->name == 'cod') {
                OldOrder::find($order_id)->update(['payment_status' => 'Unpaid', 'payment_status_description' => 'Cancelled Order']);
            }
        }
        // Update Order Total if Product is Cancelled
        if ($order['status'] == 'Cancelled') {
            return $this->reloadOrder($selected_order->id);
        }
        // Update Order Status if All Products are Returned
        if ($selected_order->products()->wherePivot('status', 'Returned')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Returned']);
        }
        // Update Order Status if All Products are Rejected
        if ($selected_order->products()->wherePivot('status', 'Rejected')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Rejected']);
        }
        // Update Order Status if All Products are Refunded
        if ($selected_order->products()->wherePivot('status', 'Refunded')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Refunded']);
        }
        // Update Order Status if All Products are Delivered failed
        if ($selected_order->products()->wherePivot('status', 'Delivered failed')->count() == $selected_order->products()->count()) {
            OldOrder::find($order_id)->update(['status' => 'Delivered failed']);
        }
        if ($old_status != OldOrder::find($order_id)->status) {
            // OldMail::to($selected_order->user->email)->send(new UserOrderUpdatedMail($selected_order, $selected_order->products()->find($product_id)));
        }
        $this->reloadOrder($selected_order->id);

        return 'ok';

        return new OrderProductResource(OrderProduct::whereOrderId($order_id)->whereProductId($product_id)->first());
    }

    //
    // public function update($order_id, $product_id, UpdateProductOrder $request)
    // {
    //   $product = $request->validated();
    //   $ordered_product = OrderProduct::whereOrderId($order_id)->whereProductId($product_id)->firstorfail();
    //
    //   $original_product = Product::find($product_id);
    //
    //
    //   $product['price'] = isset($product['price']) ? $product['price'] : $ordered_product->price;
    //   $quantity = isset($product['quantity']) ? $product['quantity'] : $ordered_product->quantity;
    //   $coupon_discount_precentage = $ordered_product->coupon_discount;
    //   $product['purchase_price'] = $product['price'];
    //   $product['subtotal'] = $product['price'] * $quantity;
    //   $shipping_fees = isset($product['shipping_fees']) ? $product['shipping_fees'] : $ordered_product->shipping_fees;
    //   $product['commission'] = $product['subtotal'] * $original_product->vendor->vendor->commission / 100;
    //   $product['vendor_revenue'] = $product['subtotal'] - $product['commission'];
    //
    //   OrderProduct::whereOrderId($order_id)->whereProductId($product_id)->update($product);
    //
    //   return $this->reloadOrder($order_id);
    //
    // }
    //
    //
    public function reloadOrder($order_id)
    {
        $order = OldOrder::find($order_id);
        $products = $order->products()->wherePivot('status', '!=', 'Cancelled')->get()->pluck('pivot');
        $order = $order->update([
            'subtotal' => collect($products)->sum('subtotal'),
            'shipping_fees' => collect($products)->sum('shipping_fees'),
            'shipping_discount' => collect($products)->sum('shipping_discount'),
            'total' => intval(collect($products)->sum('subtotal')) + intval(collect($products)->sum('shipping_fees')),
            // 'total' => intVal(collect($products)->sum('total')),
            'commission' => collect($products)->sum('commission'),
            'vendor_revenue' => collect($products)->sum('vendor_revenue'),
        ]);

        return OldOrder::find($order_id);
    }
    //
    //
}
