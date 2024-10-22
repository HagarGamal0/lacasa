<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\Tag as TagResource;
use App\Models\Catalog\Tag;
use Spatie\QueryBuilder\QueryBuilder;

class TagController extends Controller
{
    public function index()
    {
        return TagResource::collection(QueryBuilder::for(Tag::class)
        ->allowedFilters([
            'name',
        ])->paginate());
    }

    public function show($id)
    {
        return TagResource::collection(Tag::find($id));
    }
}
