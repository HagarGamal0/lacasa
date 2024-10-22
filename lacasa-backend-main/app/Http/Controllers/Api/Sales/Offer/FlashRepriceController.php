<?php

namespace App\Http\Controllers\Api\Sales\Offer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Offer\FlashReprice as FlashRepriceResource;
use App\Models\Sales\Offer\FlashReprice;
use Illuminate\Http\Request;

class FlashRepriceController extends Controller
{
    public function index()
    {
        return FlashRepriceResource::collection(FlashReprice::all());
    }

    public function show($id)
    {
        return new FlashRepriceResource(FlashReprice::find($id));
    }

    public function store(Request $request)
    {
        return new FlashRepriceResource(FlashReprice::create($request->validate([
            'product_id' => 'required|unique:flash_reprices',
            'start_date' => 'required|date',
            'expire_at' => 'required|date',
            'flash_price' => 'required|numeric|between:0,99.99',
        ])));
    }

    public function update(Request $request, $id)
    {
        FlashReprice::find($id)->update($request->validate([
            'product_id' => 'required|unique:flash_reprices,product_id,' . $id,
            'start_date' => 'required|date',
            'expire_at' => 'required|date',
            'flash_price' => 'required|numeric|between:0,99.99',
        ]));

        return new FlashRepriceResource(FlashReprice::find($id));
    }

    public function destroy($id)
    {
        FlashReprice::find($id)->delete();

        return [
            'status' => 'success',
            'message' => 'Flash Reprice was successfully destroyed',
        ];
    }
}
