<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OldOrder as OrderResource;
use App\Models\Sales\Order\OldTempOrder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TempOrderController extends Controller
{
    public function index()
    {
        return OrderResource::collection(QueryBuilder::for(OldTempOrder::class)
            ->allowedFilters([
                AllowedFilter::Exact('id'),
                'status',
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
        return new OrderResource(OldTempOrder::find($id));
    }
}
