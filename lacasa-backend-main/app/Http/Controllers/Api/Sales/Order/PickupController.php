<?php

namespace App\Http\Controllers\Api\Sales\Order;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ShippingIntegrations\Sprint;
use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\Order;
use Illuminate\Http\Request;

class PickupController extends Controller
{
    // public function index($order_id)
    // {
    //
    // }

    public function store(Request $request, $order_id)
    {
        $order = Order::findorfail($order_id);
        $shipment_request = $request->validate([
            'shipping_provider_id' => 'required|exists:shipping_providers,id',
            'products' => 'required|array',
            'products.*' => 'required|integer',
        ]);
        $shipment = $order->shipments()->firstOrCreate([
            'shipping_provider_id' => $shipment_request['shipping_provider_id'],
            'airway_bill' => null,
            'pickup_date' => null,
            'pickup_ref' => null,
            'vendor_id' => Product::find($shipment_request['products'][0])->vendor_id,
        ]);
        $order->cart->items()->whereIn('id', $shipment_request['products'])->update(['shipment_id' => $shipment->id]);

        return $shipment;
    }

    public function update($order_id, $shipment_id, Request $request)
    {
        $order = Order::findorfail($order_id);
        $shipment = $order->shipments()->findorfail($shipment_id);
        $shipping_provider = $shipment->shipping_provider;
        // return 'asd';
        if ($shipping_provider->key == 'sprint' && $shipment->pickup_date == null) {
            Sprint::createSprintShipment($shipment);
        }

        return $shipment->fresh();
    }
}
