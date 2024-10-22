<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only('update');
    }

    public function index()
    {
        return OrderResource::collection(QueryBuilder::for(Cart::whereNull('orderable_id'))
                // ->with('activities')
            ->allowedFilters([
                AllowedFilter::Exact('id'),
                'status',
                'payment_id',
                AllowedFilter::Exact('payment_status'),
                'payment_method.name',
                AllowedFilter::Exact('payment_method.id'),
                AllowedFilter::Exact('payment_order_id'),
                AllowedFilter::Exact('user.id'),
                AllowedFilter::Exact('user.phone'),
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after'),
                // AllowedFilter::scope('total_from'),
                // AllowedFilter::scope('total_to'),
            ])
            ->defaultSort('-id')
            ->paginate(24));
    }
}
