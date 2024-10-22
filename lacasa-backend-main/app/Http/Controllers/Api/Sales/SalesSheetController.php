<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use App\Http\Resources\Sales\SalesSheetResource;
use App\Models\SalesSheetItem;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SalesSheetController extends Controller
{

    public function index()
    {
        return SalesSheetResource::collection(QueryBuilder::for(SalesSheetItem::class)
            ->with('sheet_entry')
            ->allowedFilters([
                AllowedFilter::scope('created_before'),
                AllowedFilter::scope('created_after')
            ])
            ->defaultSort('order_id')
            ->paginate(24));
    }
}
