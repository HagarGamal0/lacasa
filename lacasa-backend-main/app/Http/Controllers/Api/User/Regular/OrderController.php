<?php

namespace App\Http\Controllers\Api\User\Regular;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\Order as OrderResource;
// use App\Http\Resources\User\Regular\Order as OrderResource;
use Auth;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return OrderResource::collection(Auth::user()->orders()->orderBy('id', 'DESC')->paginate());
    }

    public function show($id)
    {
        return new OrderResource(Auth::user()->orders()->find($id));
    }
}
