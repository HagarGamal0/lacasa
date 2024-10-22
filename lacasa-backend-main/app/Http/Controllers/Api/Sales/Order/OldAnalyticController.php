<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sales\Order\OldOrderProduct;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Models\Sales\Order\OldOrder;
use App\Http\Resources\User\RegularUser as UserResource;
use App\Http\Resources\User\Analytics as UserAnalyticsResource;
use App\Models\User\User;
use DB;
use Carbon\Carbon;

class OldAnalyticController extends Controller
{
    public function index(Request $request){
      
        $products = QueryBuilder::for(OldOrderProduct::class)->allowedFilters([
            AllowedFilter::scope('created_before'),
            AllowedFilter::scope('created_after'),
        ])->with(['order.payment_method'])->get();
        
        
        
        
        $orders = QueryBuilder::for(OldOrder::class)
            ->allowedFilters([
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after'),
            ])->get();
        // $revenue = $products->whereIn('status', ['Delivered', 'Shipped', 'Processing', 'Confirmed']);
        $revenue = $products;
        $revenueCOD = $revenue->where('order.payment_method.name', 'cod');
        $revenueCard = $revenue->where('order.payment_method.name', 'paymob');
        $revenueValU = $revenue->where('order.payment_method.name', 'valu');
        
          
        $created_before = isset($request['find']['created_before']) ? $request['find']['created_before'] : Carbon::now()->endOfYear();
        $created_after = isset($request['find']['created_after']) ? $request['find']['created_after'] : Carbon::now()->subYears(1);
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
                            ]
                        ]
                    ],
                    'analytics' => [
                        'orders' => [
                            'total' => [
                                'cod' => $orders->where('payment_method.name', 'cod')->count(),
                                'card' => $orders->where('payment_method.name', 'paymob')->count(),
                                'valu' => $orders->where('payment_method.name', 'valu')->count(),
                                'total' => $orders->count()
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
                                'total' => $products->count()
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
                          'most_sold' => DB::table('products')->select([
                                    'products.id',
                                    'products.name',
                                    'products.slug',
                                    DB::raw('SUM(old_orders_products.quantity) as total_sales'),
                                    DB::raw('SUM(old_orders_products.purchase_price * old_orders_products.quantity) AS total_price'),
                                ])
                                ->join('old_orders_products', 'old_orders_products.product_id', '=', 'products.id')
                                ->join('orders', 'old_orders_products.order_id', '=', 'orders.id')
                                // ->where('orders.status', '!=','pending')
                                ->whereDate('orders.created_at', '>=', $created_after)
                                ->whereDate('orders.created_at', '<=', $created_before)
                                ->groupBy('products.id')
                                ->orderByDesc('total_sales')
                                ->take(10)
                                ->get(),
                          'most_viewed' => 
                            DB::table('products')->select([
                                      'products.id',
                                      'products.name',
                                      'products.slug',
                                      DB::raw('SUM(traffic.visits) as total_hits'),
                                      DB::raw('COUNT(*) as unique_views'),
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
                            'data' => UserResource::collection(User::has('orders', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->orderByDesc('id')->take(10)->get()),
                            'count' => 
                              User::has('orders', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->count(),
                            'orders_count' => 
                            User::has('orders', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->count(),
                            ],
                          'returning' => 
                          [
                            'data' => UserResource::collection(User::has('orders', '>', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->orderByDesc('id')->take(10)->get()),
                            'count' => User::has('orders', '>', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->count(),
                            'orders_count' => 
                            User::has('orders', '>', 1)->whereHas('orders', function($query)use($created_before,$created_after){
                                $query->whereDate('created_at', '<=', Carbon::parse($created_before))->whereDate('created_at', '>=', Carbon::parse($created_after));
                              })->withCount('orders')->get()->sum('orders_count')
                          ],
                          
                            
                        
                        ]
                    ]
                ]
            ]
        ];
    }
}
