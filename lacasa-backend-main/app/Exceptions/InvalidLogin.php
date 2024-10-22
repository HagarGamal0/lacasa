<?php

namespace App\Exceptions;

use Exception;

class InvalidLogin extends Exception
{
    public function render($request)
    {
        return response()->json([
            'code' => 401,
            'status' => 'Unauthorized',
            'message' => 'Invalid email or password.',
            'errors' => [
            ],
        ], 401);
    }
}
