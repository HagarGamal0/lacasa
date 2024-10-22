<?php

namespace App\Http\Controllers\Api\User;

use Log;
use App\Http\Controllers\Controller;
use App\Http\Helpers\SMSMisrHelper;
use App\Http\Requests\User\OTPRequest;
use App\Http\Requests\User\OTPVerificationRequest;
use App\Models\PhoneOTP;
use function App\Http\Helpers\generateRandomString;

class SMSVerificationController extends Controller
{
    public function sendOTP(OTPRequest $request)
    {
        $data = $request->safe()->only(['phone']);
        $otp_record = PhoneOTP::where('phone', $data['phone'])->first();
        if($otp_record) {
            $otp_record->update(['verified' => 0]);
        }
        try {
            $otp = strtolower(generateRandomString(6));
            PhoneOTP::updateOrCreate([
                'phone' => $data['phone']
            ], [
                'otp' => $otp
            ]);
            $sms_res = SMSMisrHelper::sendOTP('2' . $data['phone'], $otp);

            return response()->json([
                'status' => 'otp_sent',
                'sms' => $sms_res
            ], 201);
        } catch (\Throwable $th) {
            Log::debug($th->getMessage());
            return response()->json([
                'status' => 'error'
            ], 500);
        }
    }

    public function verifyOTP(OTPVerificationRequest $request)
    {
        $data = $request->safe()->only(['phone', 'otp']);
        $otp_record = PhoneOTP::where([
            'phone' => $data['phone'],
            'otp' => strtolower($data['otp'])
        ])->first();
        if(!$otp_record) {
            return response()->json([
                'status' => 'incorrect_otp'
            ], 404);
        }
        $otp_record->update(['verified' => 1]);
        return response()->json([
            'status' => 'verified'
        ]);
    }
}
