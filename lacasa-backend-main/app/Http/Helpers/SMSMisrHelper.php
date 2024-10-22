<?php

namespace App\Http\Helpers;

use GuzzleHttp\Client;

class SMSMisrHelper
{
    public static function sendOTP(string $mobile, string $otp)
    {
        $client = new Client();
        $res = $client->request('POST', 'https://smsmisr.com/api/OTP/', [
            'query' => [
                'environment' => (int) env('SMS_MISR_ENVIRONMENT', ''),
                'username' => env('SMS_MISR_USERNAME', ''),
                'password' => env('SMS_MISR_PASSWORD', ''),
                'sender' => env('SMS_MISR_SENDER', ''),
                'mobile' => $mobile,
                'template' => env('SMS_MISR_TEMPLATE', ''),
                'otp' => $otp,
            ]
        ]);
        return [
            'response' => $res->getStatusCode(),
            'body' => $res->getBody()->getContents()
        ];
    }
}
