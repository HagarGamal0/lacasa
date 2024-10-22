<?php

namespace App\Http\Helpers\ShippingIntegrations;

use App\Models\Sales\Shipping\Shipment;
use Carbon\Carbon;
use Exception;
use Http;

class Sprint
{
    public static function createSprintShipment(Shipment $shipment)
    {
        if ($shipment->airway_bill == null) {
            $airway_bill = self::createAirwayBill($shipment);
        } else {
            $airway_bill = $shipment->airway_bill;
        }

        return self::createPickup($shipment);
    }

    public static function createAirwayBill(Shipment $shipment)
    {
        // Needed Client DATA:
        $cod = 0;
        $CargoValue = 0;
        // return $shipment->order->products->whereIn('product_id', $shipment->products->pluck('id'));
        foreach ($shipment->order->products->whereIn('product_id', $shipment->products->pluck('id')) as $order_product) {
            $cod = $cod + $order_product->pivot->subtotal + $order_product->pivot->shipping_fees;
            $CargoValue = $CargoValue + $order_product->pivot->subtotal;
        }
        $cod = $shipment->order->payment_method->name == 'cod' ? $cod : 0;
        $consignee = $shipment->order->address;
        $shipment_data = [
            'waybillRequestData' => [
                'FromOU' => 'CAIRO',
                'WaybillNumber' => '',
                'DeliveryDate' => '',
                'ClientCode' => 'BMW',
                'CustomerCode' => 'BMW',
                'ConsigneeCode' => '00000',
                'ConsigneeAddress' => $consignee->address,
                'ConsigneeCountry' => 'EG',
                // "ConsigneeState" => 'Cairo',
                'ConsigneeState' => $consignee->area->city->sprint_state_code,
                // "ConsigneeCity" => 'Cairo',
                'ConsigneeCity' => $consignee->area->sprint_city,
                'ConsigneeName' => $consignee->first_name . ' ' . $consignee->last_name,
                'ConsigneePhone' => $consignee->phone,
                'NumberOfPackages' => 1,
                'ActualWeight' => 1,
                'ChargedWeight' => 1,
                'ReferenceNumber' => '123456789',
                'PaymentMode' => 'TBB',
                'ServiceCode' => 'PUD',
                'WeightUnitType' => 'KILOGRAM',
                'Description' => 'Item 1',
                'CargoValue' => $CargoValue,
                'COD' => $cod,
                'CODPaymentMode' => 'CASH',
                'CreateWaybillWithoutStock' => 'false',
            ],
        ];
        $response = Http::post('https://api.logixplatform.com/webservice/v2/CreateWaybill?secureKey=032DEAEA3E1D4CF1AD7DE1FDFA437689',
            $shipment_data)->object();
        if ($response->messageType == 'Error') {
            throw new Exception($response->message);
        }
        $shipment->update([
            'airway_bill' => $response->waybillNumber,
            'shipping_label' => $response->labelURL,
        ]);

        return $response;
    }

    public static function createPickup(Shipment $shipment)
    {
        // $vendor = $shipment->vendor->vendor;
        // return $shipment->items;
        $vendors = $shipment->items()->with(['product.vendor.vendor.area.city'])->get()->groupBy('product.vendor_id');
        foreach ($vendors as $vendor) {
            $vendor = $vendor[0]->product->vendor->vendor;
            $pickup_data = [
                'readyTime' => '09:00:00',
                'latestTimeAvailable' => '05:00:00',
                'pickupCity' => $vendor->area->sprint_city,
                'pickupAddress' => $vendor->street_address,
                'pickupCountry' => 'Egypt',
                'pickupState' => $vendor->area->city->sprint_state_code,
                'pickupDate' => Carbon::now()->addDays(1)->format('Y-m-d'),
                'clientCode' => 'BMW',
                'wayBillNumbers' => $shipment->airway_bill,
                'pickupType' => 'standard',
                'specialInstruction' => '',
                'consignorCode' => 'BMW',
            ];

            $response = Http::asForm()->post('https://api.logixplatform.com/webservice/v2/CreatePickupRequest?secureKey=032DEAEA3E1D4CF1AD7DE1FDFA437689',
                $pickup_data)->object();
            if ($response->messageType == 'Error') {
                throw new Exception($response->message);
            }
        }

        $shipment->update([
            'pickup_date' => Carbon::now()->addDays(1)->format('Y-m-d'),
        ]);

        return $response;
    }
}
