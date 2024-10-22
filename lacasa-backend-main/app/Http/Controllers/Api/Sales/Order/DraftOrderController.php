<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\DraftOrder as OrderResource;
use App\Models\Sales\Order\DraftOrder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DraftOrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only('update');
    }

    public function index()
    {
        return OrderResource::collection(QueryBuilder::for(DraftOrder::class)
                // ->with('activities')
                ->has('cart')
                ->allowedFilters([
                    AllowedFilter::Exact('id'),
                    'status',
                    'payment_id',
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
                    // AllowedFilter::scope('total_from'),
                    // AllowedFilter::scope('total_to'),
                ])
                ->defaultSort('-id')
                ->paginate(24));
    }

    public function show($id)
    {
        return new OrderResource(DraftOrder::find($id));
    }
}
