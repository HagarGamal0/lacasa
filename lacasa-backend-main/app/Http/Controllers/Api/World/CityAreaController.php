<?php

namespace App\Http\Controllers\Api\World;

use App\Http\Controllers\Controller;
use App\Http\Resources\World\City as CityResource;
use App\Models\World\City;
use Illuminate\Support\Facades\Cache;
class CityAreaController extends Controller
{
    public function index($city_id)
    {
        $local = request()->header('X-localization');
        $cities = Cache::remember("city_{$local}_{$city_id}", 60 * 30, function () use($city_id) {
            return CityResource::collection(City::find($city_id)->areas()->where('trash', 0)->get());
        });
        return ["data" => $cities];
    }
}
