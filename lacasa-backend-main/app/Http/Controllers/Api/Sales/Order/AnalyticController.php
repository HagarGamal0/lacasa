<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\Analytics as UserAnalyticsResource;
use App\Http\Resources\User\RegularUser as UserResource;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Order\Order;
use App\Models\User\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AnalyticController extends Controller
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
        if (\Auth::user()->is_vendor()) {
            $request->merge(['find' => collect($request['find'])->merge(['vendor_id' => \Auth::id()])]);
        }
        $products = QueryBuilder::for(CartItem::class)
            ->allowedFilters([
                AllowedFilter::Exact('type', 'cart.status')->default('Order'),
                AllowedFilter::scope('created_before', 'cart.order.created_before'),
                AllowedFilter::scope('created_after', 'cart.order.created_after'),
                AllowedFilter::Exact('payment_method_id', 'cart.order.payment_method_id'),
                AllowedFilter::Exact('status', 'cart.order.status'),
                AllowedFilter::Exact('vendor_id', 'product.vendor_id'),
                AllowedFilter::Exact('show_in_secondary', 'cart.order.show_in_secondary'),
            ])
            ->defaultSort('-id')
            ->get();

        $users = QueryBuilder::for(User::withCount('orders'))
            ->allowedFilters([
                AllowedFilter::scope('created_before', 'orders.created_before'),
                AllowedFilter::scope('created_after', 'orders.created_after'),
                AllowedFilter::scope('vendor_id', 'orders.vendor_filter'),
                AllowedFilter::Exact('status', 'orders.status'),
                AllowedFilter::Exact('payment_method_id', 'orders.payment_method_id'),
                AllowedFilter::Exact('show_in_secondary', 'orders.show_in_secondary'),
            ])
            ->defaultSort('-id')
            ->get();

        $orders = QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after'),
                AllowedFilter::Exact('payment_method_id', 'payment_method_id'),
                AllowedFilter::Exact('status', 'status'),
                AllowedFilter::scope('vendor_id', 'vendor_filter'),
                AllowedFilter::Exact('show_in_secondary'),
            ])
            ->defaultSort('-id')
            ->get();

        foreach (CarbonPeriod::create($request['find']['created_after'], $request['find']['created_before']) as $month) {
            $months[$month->format('M Y')] = [
                'month' => $month->format('M Y'),
                'count' => 0,
                'total_sales' => 0,
            ];
        }
        $cart1 = $products->where('status', 'Arrived')->groupBy(function ($date) {
            return Carbon::parse($date->first()->created_at)->format('M Y'); // grouping by years
        })->map(function ($item, $key) {
            return [
                'month' => $item[0]->created_at->format('M Y'),
                'sold_items_count' => $item->count(),
                'total_sales' => $item->sum('subtotal'),
                'total_discounts' => $item->sum('total_discounts'),
                'total_shipping_fees' => $item->sum('shipping_fees'),
                'total' => $item->sum('total'),
            ];
        });

        $trending = $products->groupBy('product.name')->map(function ($product, $key) {
            return [
                'image' => $product->first()->product->images[0]->url,
                'name' => $key,
                'slug' => $product->first()->product->slug,
                'price' => $product->first()->product->price_after_sale,
                'sales' => $product->count(),
            ];
        })->sortByDesc('sales')->take(5)->values();
        foreach ($months as $key => $month) {
            $exist = $cart1->where('month', $key)->first();
            if ($exist) {
                $months[$key] = $exist;
            }
        }
        $cart1 = collect($months);

        return [
            'data' => [
                'products' => [
                    'count' => $products->count(),
                    'arrived' => $products->where('status', 'Arrived')->count(),
                    'pending' => $products->where('status', 'Pending Confirmation')->count(),
                    'ready_to_ship' => $products->where('status', 'Ready To Ship')->count(),
                    'processing' => $products->filter(fn ($product) => 'Returned' !== $product['status'] && 'Ready To Ship' !== $product['status'] && 'Returned' === $product['status'] && 'Rejected' !== $product['status'] && 'Refunded' !== $product['status'])->count(),
                    'returned_rejected_refunded' => $products->filter(fn ($product) => 'Returned' === $product['status'] || 'Rejected' === $product['status'] || 'Refunded' === $product['status'])->count(),
                ],
                'users' => [
                    'count' => $users->count(),
                    'returning_customers' => $users->where('orders_count', '>', 1)->count(),
                    'first_order' => $users->where('orders_count', 1)->count(),
                ],
                'orders' => [
                    'count' => $orders->count(),
                    'pending' => $products->where('status', 'Pending Confirmation')->count(),
                    'arrived' => $orders->where('status', 'Arrived')->count(),
                    'processing' => $orders->filter(fn ($order) => 'Returned' !== $order['status'] && 'Ready To Ship' !== $order['status'] && 'Returned' === $order['status'] && 'Rejected' !== $order['status'] && 'Refunded' !== $order['status'])->count(),
                    'returned_rejected_refunded' => $orders->filter(fn ($order) => 'Returned' === $order['status'] || 'Rejected' === $order['status'] || 'Refunded' === $order['status'])->count(),
                ],
                // 'total_products_count' => $site_products->count(),
                'sales' => [
                    'incomplete' =>  $products->filter(fn ($product) => 'Arrived' !== $product['status'] && 'Returned' !== $product['status'] && 'Rejected' !== $product['status'] && 'Refunded' !== $product['status'])->sum('total'),
                    'total' => $products->sum('total'),
                    'commissions' => $products->sum('commission'),
                    'vendor_revenue' => $products->sum('vendor_revenue'),
                    'vendor_debit' => max($products->sum('commission') - $products->where('cart.order.payment_method.name', '!=', 'cod')->sum('total'), 0),
                    'lacasa_debit' => max($products->sum('commission') - $products->where('cart.order.payment_method.name', 'cod')->sum('total'), 0),
                    'total_shipping_fees' => $products->sum('total_shipping_fees'),
                ],
                // 'sales' => [
                //     'incomplete' =>  $products->filter(function ($product) {
                //         return $product['status'] != 'Arrived'  &&  $product['status'] != 'Returned' && $product['status'] != 'Rejected' && $product['status'] != 'Refunded';
                //     })->sum('total'),
                //     'total' => $products->where('status', 'Arrived')->sum('total'),
                //     'commissions' => $products->where('status', 'Arrived')->sum('commission'),
                //     'vendor_revenue' => $products->where('status', 'Arrived')->sum('vendor_revenue'),
                //     'vendor_debit' => max($products->where('status', 'Arrived')->sum('commission') - $products->where('status', 'Arrived')->where('cart.order.payment_method.name', '!=', 'cod')->sum('total'), 0),
                //     'lacasa_debit' => max($products->where('status', 'Arrived')->sum('commission') - $products->where('status', 'Arrived')->where('cart.order.payment_method.name', 'cod')->sum('total'), 0),
                // ],
                'chart1' => [
                    'months' => $cart1->pluck('month'),
                    'sales_count' => $cart1->pluck('sold_items_count'),
                    'total_sales' => $cart1->pluck('total_sales'),
                ],
                'trending' => $trending,
            ],
        ];

        // $products = QueryBuilder::for(CartItem::whereHas('order', function ($query) {
        //     $query->valid();
        // }))->allowedFilters([
        //     AllowedFilter::scope('created_before'),
        //     AllowedFilter::scope('created_after'),
        // ])->with(['order.payment_method'])->get();

        $orders = QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after'),
                AllowedFilter::Exact('show_in_secondary'),
            ])->get();
        // $revenue = $products->whereIn('status', ['Delivered', 'Shipped', 'Processing', 'Confirmed']);
        $revenue = $products;
        $revenueCOD = $revenue->where('order.payment_method.name', 'cod');
        $revenueCard = $revenue->where('order.payment_method.name', 'paymob');
        $revenueValU = $revenue->where('order.payment_method.name', 'valu');

        $created_before = $request['find']['created_before'] ?? Carbon::now()->endOfYear();
        $created_after = $request['find']['created_after'] ?? Carbon::now()->subYears(1);
        // return Product::whereHas('orders', function($query)use($created_after,$created_before){
        //   $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
        // })->get();
        // $users = QueryBuilder::for(User::class)
        // ->allowedFilters([
        //   AllowedFilter::scope('created_before'),
        //   AllowedFilter::scope('created_after'),
        //   ])->withCount('orders')->defaultSort('-id')->get();
        // return Carbon::parse($created_before);

        // return ;
        return [
            'data' => [
                'filters' => $request['find'],
                'result' => [
                    'revenue' => [
                        'vendor_revenue' => $revenue->sum('vendor_revenue'),
                        'commission' => $revenue->sum('commission'),
                        'orders_sales' => $orders->sum('total'),
                        'orders_sales_subtotal' => $orders->sum('subtotal'),
                        // 'products_sales' => $orders->sum('total'),
                        'products_sales_subtotal' => $products->sum('subtotal'),
                        'status' => [
                            'processing' => [
                                'vendor_revenue' => $revenue->where('status', 'Processing')->sum('vendor_revenue'),
                                'commission' => $revenue->where('status', 'Processing')->sum('commission'),
                            ],
                            'confirmed' => [
                                'vendor_revenue' => $revenue->where('status', 'Confirmed')->sum('vendor_revenue'),
                                'commission' => $revenue->where('status', 'Confirmed')->sum('commission'),
                            ],
                            'shipped' => [
                                'vendor_revenue' => $revenue->where('status', 'Shipped')->sum('vendor_revenue'),
                                'commission' => $revenue->where('status', 'Shipped')->sum('commission'),
                            ],
                            'complete' => [
                                'vendor_revenue' => $revenue->where('status', 'Delivered')->sum('vendor_revenue'),
                                'commission' => $revenue->where('status', 'Delivered')->sum('commission'),
                            ],

                        ],
                        'payment_methods' => [
                            'cod' => [
                                'vendor_revenue' => $revenueCOD->sum('vendor_revenue'),
                                'commission' => $revenueCOD->sum('commission'),
                            ],
                            'card' => [
                                'vendor_revenue' => $revenueCard->sum('vendor_revenue'),
                                'commission' => $revenueCard->sum('commission'),
                            ],
                            'valu' => [
                                'vendor_revenue' => $revenueValU->sum('vendor_revenue'),
                                'commission' => $revenueValU->sum('commission'),
                            ],
                        ],
                    ],
                    'analytics' => [
                        'orders' => [
                            'total' => [
                                'cod' => $orders->where('payment_method.name', 'cod')->count(),
                                'card' => $orders->where('payment_method.name', 'paymob')->count(),
                                'valu' => $orders->where('payment_method.name', 'valu')->count(),
                                'total' => $orders->count(),
                            ],
                            'pending' => $orders->where('status', 'pending')->count(),
                            'processing' => $orders->where('status', 'Processing')->count(),
                            'confirmed' => $orders->where('status', 'Confirmed')->count(),
                            'shipped' => $orders->where('status', 'Shipped')->count(),
                            'returned' => $orders->where('status', 'Returned')->count(),
                            'rejected' => $orders->where('status', 'Rejected')->count(),
                            'refunded' => $orders->where('status', 'Refunded')->count(),
                            'delivery_failed' => $orders->where('status', 'Delivered failed')->count(),
                            'cancelled' => $orders->where('status', 'Cancelled')->count(),
                            'complete' => $orders->where('status', 'Complete')->count(),
                        ],
                        'ordered_products' => [
                            'total' => [
                                'cod' => $products->where('order.payment_method.name', 'cod')->count(),
                                'card' => $products->where('order.payment_method.name', 'paymob')->count(),
                                'valu' => $products->where('order.payment_method.name', 'valu')->count(),
                                'total' => $products->count(),
                            ],
                            'pending' => $products->where('status', 'pending')->count(),
                            'processing' => $products->where('status', 'Processing')->count(),
                            'confirmed' => $products->where('status', 'Confirmed')->count(),
                            'shipped' => $products->where('status', 'Shipped')->count(),
                            'returned' => $products->where('status', 'Returned')->count(),
                            'rejected' => $products->where('status', 'Rejected')->count(),
                            'refunded' => $products->where('status', 'Refunded')->count(),
                            'delivery_failed' => $products->where('status', 'Delivered failed')->count(),
                            'cancelled' => $products->where('status', 'Cancelled')->count(),
                            'delivered' => $products->where('status', 'Delivered')->count(),
                        ],
                        'products' => [
                            // 'most_sold' =>
                            'most_sold' => \DB::table('products')->select([
                                'products.id',
                                'products.name',
                                'products.slug',
                                \DB::raw('SUM(orders_products.quantity) as total_sales'),
                                \DB::raw('SUM(orders_products.purchase_price * orders_products.quantity) AS total_price'),
                            ])
                                ->join('orders_products', 'orders_products.product_id', '=', 'products.id')
                                ->join('orders', 'orders_products.order_id', '=', 'orders.id')
                                  // ->where('orders.status', '!=','pending')
                                ->whereDate('orders.created_at', '>=', $created_after)
                                ->whereDate('orders.created_at', '<=', $created_before)
                                ->groupBy('products.id')
                                ->orderByDesc('total_sales')
                                ->take(10)
                                ->get(),
                            'most_viewed' => \DB::table('products')->select([
                                'products.id',
                                'products.name',
                                'products.slug',
                                \DB::raw('SUM(traffic.visits) as total_hits'),
                                \DB::raw('COUNT(*) as unique_views'),
                            ])
                                ->join('traffic', 'traffic.trafficable_id', '=', 'products.id')
                                ->where('traffic.trafficable_type', 'like', '%product%')
                                ->whereDate('traffic.updated_at', '>=', $created_after)
                                ->whereDate('traffic.updated_at', '<=', $created_before)
                                ->groupBy('products.id')
                                ->orderByDesc('unique_views')
                                ->take(10)
                                ->get(),

                        ],
                        // 'users' => [
                        //     'signups' => $users->count(),
                        //     'orders' => $users->sum('orders_count'),
                        //     'data' => UserAnalyticsResource::collection($users),
                        // ],
                        // 'users' => $users,
                        'customers' => [
                            'first_order' => [
                                'data' => UserResource::collection(User::has('orders', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->orderByDesc('id')->take(10)->get()),
                                'count' => User::has('orders', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->count(),
                                'orders_count' => User::has('orders', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->count(),
                            ],
                            'returning' => [
                                'data' => UserResource::collection(User::has('orders', '>', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->orderByDesc('id')->take(10)->get()),
                                'count' => User::has('orders', '>', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->count(),
                                'orders_count' => User::has('orders', '>', 1)->whereHas('orders', function ($query) use ($created_before, $created_after) {
                                    $query->valid()->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                                })->withCount('orders')->get()->sum('orders_count'),
                            ],

                        ],
                    ],
                ],
            ],
        ];
    }
}
