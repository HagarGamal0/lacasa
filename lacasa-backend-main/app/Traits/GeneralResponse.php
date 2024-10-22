<?php

namespace App\Traits;
use Illuminate\Http\Responce;

class GeneralResponse
{
    public static function responseMessage($title, $message, $code = 200, $data = null, $errors = null)
    {

        return response()->json([
            'code'    => $code,
            'status'  => $title,
            'message' => $message,
            'data'    => $data,
            'errors'  => $errors
        ],$code);
    }


}
