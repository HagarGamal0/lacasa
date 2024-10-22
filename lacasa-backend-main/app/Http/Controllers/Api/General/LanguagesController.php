<?php

namespace App\Http\Controllers\Api\General;

use App\Http\Controllers\Controller;
use App\Http\Resources\General\LanguagesResource;
use function App\Http\Helpers\getLanguages;

class LanguagesController extends Controller
{
    public function index()
    {
        return  LanguagesResource::collection(getLanguages());
    }
}
