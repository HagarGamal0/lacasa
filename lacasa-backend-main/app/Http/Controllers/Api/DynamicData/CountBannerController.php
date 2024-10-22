<?php

namespace App\Http\Controllers\Api\DynamicData;

use Str;
use Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Models\StaticData\CountBanner;
use App\Http\Requests\DynamicData\CreateCountBanner;
use App\Http\Requests\DynamicData\UpdateCountBanner;
use App\Http\Resources\DynamicData\CountBanner as CountBannerResource;

class CountBannerController extends Controller
{
    public function index()
    {
        $banners = Cache::remember("count_banner_", 60 * 30, function () {
            return CountBanner::all();
        });
        return CountBannerResource::collection($banners);
    }

    public function show($id)
    {
        return new CountBannerResource(CountBanner::find($id));
    }

    public function store(CreateCountBanner $request)
    {
        $banner = $request->validated();
        $image = $request->file('image_url');
        $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
        $image = Storage::put('public/counter_banner/' . $fileName, file_get_contents($image), 'public');
        $banner['image_url'] = Storage::url('public/counter_banner/' . $fileName);

        return new CountBannerResource(CountBanner::create($banner));
    }

    public function update(UpdateCountBanner $request, $id)
    {
        $banner = $request->validated();
        if ($request->has('image_url')) {
            $image_url = CountBanner::find($id)->image_url;
            $image_url = str_replace(Storage::url('public'), 'public', $image_url);
            Storage::delete($image_url);

            $image = $request->file('image_url');
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/counter_banner/' . $fileName, file_get_contents($image), 'public');
            $banner['image_url'] = Storage::url('public/counter_banner/' . $fileName);
        }
        CountBanner::find($id)->update($banner);

        return new CountBannerResource(CountBanner::find($id));
    }

    public function destroy($id)
    {
        $image_url = CountBanner::find($id)->image_url;
        $image_url = str_replace(Storage::url('public'), 'public', $image_url);
        Storage::delete($image_url);
        CountBanner::find($id)->delete();

        return [
            'status' => 'success',
            'message' => 'deleted successfuly',
        ];
    }
}
