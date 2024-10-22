<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\OrderProduct;
use Auth;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AnalyticController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $request->validate([
            'vendor_id' => 'nullable|exists:vendors,user_id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
        ]);
        if (empty($request->from_date)) {
            $request['from_date'] = Carbon::now()->subMonths(11)->format('Y-m-d H:i:s');
            $request['to_date'] = Carbon::now()->endOfMonth()->format('Y-m-d H:i:s');
        }

        if (Auth::user()->is_vendor()) {
            $vendor_id = Auth::id();
        } else {
            if (empty($request->vendor_id)) {
                throw ValidationException::withMessages(['vendor_id' => 'vendor_id is required']);
            }
            $vendor_id = $request->vendor_id;
        }

        foreach (CarbonPeriod::create($request['from_date'], $request['to_date']) as $month) {
            $months[$month->format('M Y')] = [
                'month' => $month->format('M Y'),
                'count' => 0,
                'total_sales' => 0,
            ];
        }
        $vendor_orders = OrderProduct::with('product')->whereHas('product', function (Builder $query) use ($vendor_id) {
            $query->where('vendor_id', $vendor_id);
        })->whereHas('order', function (Builder $query) use ($request) {
            $query->whereBetween('created_at', [$request->from_date, $request->to_date]);
        })->get();
        $delivered = $vendor_orders->where('status', 'Delivered')->values();
        $pending = $vendor_orders->where('status', '!=', 'Delivered')->where('status', '!=', 'Cancelled')->where('status', '!=', 'Returned')->where('status', '!=', 'Confirmed')->values();
        $cancelled = $vendor_orders->where('status', 'Cancelled')->values();
        $returned = $vendor_orders->where('status', 'Returned')->values();

        $analytics = $delivered->groupBy(function ($date) {
            return Carbon::parse($date->first()->order->created_at)->format('M Y'); // grouping by years
        })->map(function ($order_product, $key) {
            // unset($months['Feb 2022']);
            return [
                'month' => $order_product[0]->order->created_at->format('M Y'),
                // '_month' => Carbon::parse($order_product[0]->order->created_at),
                'count' => $order_product->count(),
                'total_sales' => $order_product->sum('subtotal'),
                'total_discounts' => $order_product->sum('coupon_discount'),
                'total_shipping_fees' => $order_product->sum('shipping_fees'),
                'total' => $order_product->sum('total'),
            ];
        });

        foreach ($months as $key => $month) {
            $exist = $analytics->where('month', $key)->first();
            if ($exist) {
                $months[$key] = $exist;
            }
        }
        $analytics = collect($months);
        // foreach($analytics as $key => $analytic)
        // {
      //     unset($months[$key]);
        // }
        // if($analytics->count() > 0)
        // {
        //   $analytics = $analytics->merge($months);
        // }else{
        //   $analytics = collect($months);
        // }

        return [
            'data' => [
                'chart1' => [
                    'months' => $analytics->pluck('month'),
                    // '_months' => $analytics->pluck('_month'),
                    'sales_count' => $analytics->pluck('count'),
                    'total_sales' => $analytics->pluck('total_sales'),
                ],
                'counters' => [
                    'total_products' => Product::whereVendorId($vendor_id)->count(),
                    'total_sales' => $analytics->sum('total_sales'),
                    'delivered' => $delivered->count(),
                    'cancelled' => $cancelled->count(),
                    'pending' => $pending->count(),
                    'returned' => $returned->count(),
                ],
                'pending_orders' => $pending->map(function ($product) {
                    return [
                        'order_id' => $product->order_id,
                        'name' => $product->product->name,
                        'slug' => $product->first()->product->slug,
                        'status' => $product->status,
                        'date' => $product->order->created_at->format('d, M H:i'),
                    ];
                })->sortBy('sales')->take(5),
                'trending_products' => collect($delivered)->groupBy('product.name')->map(function ($product, $key) {
                    return [
                        'image' => $product->first()->product->images[0]->url,
                        'name' => $key,
                        'slug' => $product->first()->product->slug,
                        'price' => $product->first()->product->price_after_sale,
                        'sales' => $product->count(),
                    ];
                })->sortByDesc('sales')->take(5)->values(),
                'applied_filters' => $request->all(),
            ],
        ];
    }
}
