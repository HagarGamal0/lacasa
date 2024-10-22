<?php

namespace App\Http\Controllers\Api\Sales\Offer;

use App\Http\Controllers\Controller;
use App\Models\Sales\Offer\OrangeVoucher;
use Auth;
use Http;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Str;

class RedeemOrangePointsController extends Controller
{
    private $wsdl = 'http://ows.e-points.net/VoucherRedemptionWS/VoucherRedemptionWS.asmx?wsdl';

    public function purchase(Request $request)
    {
        $data = $request->validate([
            'mobile' => 'required|digits:11',
            'pin' => 'required|numeric',
            'token' => 'required|string|size:36',
            'request_id' => 'required|numeric',
        ]
    
    
    
    );
        // $purchase = $this->purchaseVerification($data);
        $xml = '<?xml version="1.0" encoding="utf-8"?>
         <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
         xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
         <soap12:Body>
         <Purchase xmlns="http://tempuri.org/">
         <objPurchaseInput>
         <CountryID>' . config('orange.CountryID') . '</CountryID>
         <Token>' . $data['token'] . '</Token>
         <InvoiceNo>1</InvoiceNo>
         <StationID>' . config('orange.StationID') . '</StationID>
         <MobileNo>' . $data['mobile'] . '</MobileNo>
         <PIN>' . $data['pin'] . '</PIN>
         <RequestID>' . $data['request_id'] . '</RequestID>
         <LastTransID>1</LastTransID>
         </objPurchaseInput>
         </Purchase>
         </soap12:Body>
         </soap12:Envelope>';
        $response = Http::withHeaders([
            'Content-Type' => 'text/xml',
        ])->send('POST', $this->wsdl, [
            'body' => $xml,
        ])->getBody();
        $purchase = $this->convertJson($response);
        if ($purchase->Result == 'true') {
            $voucher = OrangeVoucher::create([
                'user_id' => Auth::guard('sanctum')->id(),
                'voucher' => 'ORANGE' . Str::random(4) . Auth::id(),
                'value' => $purchase->PurchaseAmount,
                'mobile' => $data['mobile'],
                'transaction_id' => $purchase->TransID,
                'pin' => $data['pin'],
                'remaining_points' => $purchase->AvailablePointsBalance,
            ]);

            return [
                'data' => [
                    'purchase' => $purchase,
                    'voucher' => [
                        'id' => $voucher->id,
                        'voucher' => $voucher->voucher,
                        'is_redeemed' => $voucher->is_redeemed,
                        'value' => $voucher->value,
                        'transaction_id' => $voucher->transaction_id,
                    ],
                ],
            ];
        } else {
            throw ValidationException::withMessages(['error' => $response]);
        }
    }

    public function redeem(Request $request)
    {
        $data = $request->validate([
                'mobile' => 'required|digits:11',
                'points' => 'required|numeric',
            ]
            ,
            [
                'mobile.required'     =>__('validation.required',['attribute'=>__('lang.mobile')]),
                'mobile.digits'       =>__('validation.digits',['attribute'=>__('lang.mobile'),'digits'=>'11']),
                'points.required'     =>__('validation.required',['attribute'=>__('lang.points')]),
                'points.numeric'     =>__('validation.numeric',['attribute'=>__('lang.points')]),
            ]
    
        );


        $token = $this->generateToken();
        $verfication = $this->purchaseVerification($data = [
            'mobile' => $data['mobile'],
            'token' => $token,
            'amount' => number_format((float) $data['points'] / 1000, 2, '.', ''),
        ]);

        return [
            'data' => [
                'token' => $token,
                'request_id' => $verfication->RequestID,
                'mobile' => $data['mobile'],
            ],
        ];
    }

    // public function __construct()
    // {
    //     // $this->wsdl = $wsdl;
    // }
    private function ConvertJson($xml)
    {
        $soap = simplexml_load_string($xml);
        if ($soap->children('http://schemas.xmlsoap.org/soap/envelope/')->Body?->children()?->children()) {
            $response = $soap->children('http://schemas.xmlsoap.org/soap/envelope/')->Body->children()->children();
        } else {
            $response = $soap->children('http://www.w3.org/2003/05/soap-envelope')->Body->children()->children();
        }
        $result = $response->children();

        return json_decode(json_encode($result));
    }

    private function generateToken()
    {
        $xml = '<?xml version="1.0" encoding="utf-8"?>
          <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
          <InitializeSettings xmlns="http://tempuri.org/">
          <objInitializeSettingsInput>
          <CountryID>' . config('orange.CountryID') . '</CountryID>
          <OwnerID>' . config('orange.OwnerID') . '</OwnerID>
          <StationID>' . config('orange.StationID') . '</StationID>
          </objInitializeSettingsInput>
          </InitializeSettings>
          </soap:Body>
          </soap:Envelope>';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'text/xml',
            ])->send('POST', $this->wsdl, [
                'body' => $xml,
            ])->getBody();
            $response = $this->convertJson($response);
            if ($response->Result == 'true') {
                return $response->Token;
            } else {
                throw ValidationException::withMessages(['error' => $response->ErrorDesc]);
            }
        } catch(Exception $e) {
            throw ValidationException::withMessages(['couldnt generate token']);
        }
    }

    private function purchaseVerification($data)
    {
        $xml = '<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
        <PurchaseVerification xmlns="http://tempuri.org/">
        <objPurchaseVerificationInput>
        <CountryID>' . config('orange.CountryID') . '</CountryID>
        <Token>' . $data['token'] . '</Token>
        <StationID>' . config('orange.StationID') . '</StationID>
        <MobileNo>' . $data['mobile'] . '</MobileNo>
        <PurchaseAmount>' . $data['amount'] . '</PurchaseAmount>
        </objPurchaseVerificationInput>
        </PurchaseVerification>
        </soap12:Body>
        </soap12:Envelope>';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'text/xml',
            ])->send('POST', $this->wsdl, [
                'body' => $xml,
            ])->getBody();
            // return $response;
            $response = $this->convertJson($response);
            if ($response->Result == 'true') {
                return $response;
            } else {
                throw ValidationException::withMessages(['error' => $response]);
            }
        } catch(Exception $e) {
            throw ValidationException::withMessages(['couldnt generate token']);
        }
    }
}
