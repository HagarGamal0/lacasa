<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\Attribute\AttributeResource;
use App\Models\Catalog\Product\Attribute;

class AttributeController extends Controller
{
    public function index()
    {
        return AttributeResource::collection(Attribute::all());
    }

    public function show($id)
    {
        return new AttributeResource(Attribute::with('values')->find($id));
    }
}
