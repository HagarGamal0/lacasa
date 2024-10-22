<?php

namespace App\Http\Controllers\Api\World;

use App\Http\Controllers\Controller;
use App\Http\Resources\World\City as CityResource;
use App\Models\World\City;
use Illuminate\Support\Facades\Cache;
class CityController extends Controller
{
    public function index()
    {
        $local = request()->header('X-localization');
        $cities = Cache::remember("city_{$local}", 60 * 30, function () {
            return CityResource::collection(City::where('trash', 0)->get());
        });
        return ["data" => $cities];
        
    }
}
