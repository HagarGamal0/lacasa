<?php

namespace App\Http\Controllers\Api\DynamicData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DynamicData\CreateItem as Create;
use App\Http\Requests\DynamicData\UpdateItem as Update;
use App\Http\Resources\DynamicData\DynamicItem as DynamicItemResource;
use App\Models\StaticData\DynamicItem;
use App\Models\StaticData\DynamicSection;
use Storage;
use Str;
use App\Models\Catalog\Product\Image;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use App\Traits\ClearCash;
class DynamicItemController extends Controller
{
    public $local ;
    public function __construct()
    {
        $this->local = request()->header('X-localization');
    }
    public function index($section)
    {
        $cachedResponse = Cache::remember("dynamic_items_{$this->local}_{$section}", 60 * 30, function () use ($section) {
            $collectData = DynamicSection::Section($section)->get();
            return DynamicItemResource::collection($collectData)->toJson();
        });
        $cachedResponse = json_decode($cachedResponse);

        return ["data" => $cachedResponse];
    }

    public function banners($section,$name = "")
    {
        if ($name) {
            $cachedResponse = Cache::remember("dynamic_banners_{$this->local}_{$section}_{$name}", 60 * 30, function () use ($section, $name) {
                $collectData = DynamicSection::Section($section)->get();
                foreach($collectData as $k => $data){
                    $_collectData[$data->title][] = new DynamicItemResource($data);
                }
                $collectData = $_collectData[$name];
                return $collectData;
            });
        } else {
            $cachedResponse = Cache::remember("dynamic_banners_{$this->local}_{$section}", 60 * 30, function () use ($section, $name) {
                $collectData = DynamicSection::Section($section)->get();
                foreach($collectData as $k => $data){
                    $_collectData[$data->title][] = (new DynamicItemResource($data));
                }

                return $_collectData;
            });
        }

        return ["data" => $cachedResponse];
    }

    public function show($section, $id)
    {
        $cachedResponse = Cache::remember("dynamic_banners_show_{$section}_{$id}_{$this->local}", 60 * 30, function () use ($section, $id) {
                     return new DynamicItemResource(DynamicSection::Section($section)->with('section')->find($id));
                 });
         return ["data" => $cachedResponse];
    }

    public function singleItem($id)
    {
        $cachedResponse = Cache::remember("singleItem_{$id}_{$this->local}", 60 * 30, function () use ($id) {
            return new DynamicItemResource(DynamicItem::with('section')->find($id));
        });
        return  $cachedResponse;

    }

    public function store($section, Create $request)
    {
        $sectionItem = DynamicSection::Section($section)->create(collect($request->validated())->except(['title','subtitle','description','image', 'mobile_image'])->toArray());

        if(isset($request['title']) && !empty($request['title'])){
            foreach ($request['title'] as $lang => $title) {
                $sectionItem->translateOrNew($lang)->title = $title;
            }
        }

        if(isset($request['subtitle']) && !empty($request['subtitle'])){
            foreach ($request['subtitle'] as $lang => $subtitle) {
                $sectionItem->translateOrNew($lang)->subtitle = $subtitle;
            }
        }

        if(isset($request['description']) && !empty($request['description'])){
            foreach ($request['description'] as $lang => $description) {
                $sectionItem->translateOrNew($lang)->description = $description;
            }
        }


        if ($request->has('image')) {
            $images = $request->file('image');
            foreach ($images as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/dynamic_data/' . $fileName, file_get_contents($image), 'public');
                $sectionItem->image()->create(['locale'=>$lang,'url' => Storage::url('public/dynamic_data/' . $fileName),'description' => 'Dynamic Image']);
            }
        }

        if ($request->has('mobile_image')) {
            $mobile_image = $request->file('mobile_image');
            foreach ($mobile_image as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/dynamic_data/' . $fileName, file_get_contents($image), 'public');
                $sectionItem->image()->create(['locale'=>$lang,'url' => Storage::url('public/dynamic_data/' . $fileName),'description' => 'Mobile Dynamic Image']);
            }
        }
        $sectionItem->save();
        ClearCash::flush('dynamic_items');
        return new DynamicItemResource($sectionItem);
    }

    public function update($section, Update $request, $id)
    {
        $sectionItem = DynamicSection::Section($section)->find($id)->update(collect($request->validated())->except(['title','subtitle','description','image', 'mobile_image'])->toArray());
        $sectionItem = DynamicSection::Section($section)->find($id);
        if(isset($request['title']) && !empty($request['title'])){
                foreach ($request['title'] as $lang => $title) {
                    $sectionItem->translateOrNew($lang)->title = $title;
                }
            }
        if ($request->has('subtitle')) {
            foreach ($request['subtitle'] as $lang => $subtitle) {
                $sectionItem->translateOrNew($lang)->subtitle = $subtitle;
            }
        }
        if ($request->has('description')) {
            foreach ($request['description'] as $lang => $description) {
                $sectionItem->translateOrNew($lang)->description = $description;
            }
        }
        if ($request->file('image')) {
            $oldImages =$sectionItem->image;

            $images = $request->file('image');
            foreach ($images as $lang => $image) {
                if($oldImages){
                  $sectionItem->image->where( [['imageable_id',"=",$id],['description','=','Dynamic Image'],['locale',"=",$lang]])->delete();
                }
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/dynamic_data/' . $fileName, file_get_contents($image), 'public');
                $url      =Storage::url('public/dynamic_data/' . $fileName);
                $sectionItem->image()->create(['locale'=>$lang,'url' =>$url,'description' => 'Dynamic Image']);
            }
        }

        if ($request->has('mobile_image')) {
            $oldmobileImages =$sectionItem->mobile_image;

            $mobile_image = $request->file('mobile_image');
            foreach ($mobile_image as $lang => $image) {
                if($oldmobileImages){
                     $sectionItem->mobile_image->where([['imageable_id',"=",$id],['description','=','Mobile Dynamic Image'],['locale',"=",$lang]])->delete();
                }
                $fileName  = Str::random(6) . '-' . $image->getClientOriginalName();
                $image     = Storage::put('public/dynamic_data/' . $fileName, file_get_contents($image), 'public');
                $url       = Storage::url('public/dynamic_data/' . $fileName);
                $sectionItem->image()->create(['locale'=>$lang,'url' => $url,'description' => 'Mobile Dynamic Image']);
            }
        }
        $sectionItem->save();
        ClearCash::flush('dynamic_items');
        return new DynamicItemResource($sectionItem);
    }

    public function destroy($section, $id)
    {
        $item = DynamicSection::Section($section)->find($id);
        // if($item->image->count() > 0)
        // {
        //   foreach($item->image()->get() as $image)
        //   {
        //     $image_url = $image->url;
        //     $image_url = str_replace("/storage", "", $image_url);
        //     Storage::delete(public_path($image_url));
        //     // $image->delete();
        //   }
        //   $item->image()->delete();
        // }
        //
        // if($item->mobile_image->count() > 0)
        // {
        //   foreach($item->mobile_image()->get() as $image)
        //   {
        //     $image_url = $image->url;
        //     $image_url = str_replace("/storage", "", $image_url);
        //     Storage::delete(public_path($image_url));
        //     // $image->delete();
        //   }
        //   $item->mobile_image()->delete();
        // }
        $item->delete();
        ClearCash::flush('dynamic_items');
        return response()->json([
            'code' => 202,
            'status' => 'success',
            'message' => 'Item Deleted',
        ], 202);
    }

    public function moveOrder($section, $id, $target_order)
    {
        $item = DynamicSection::Section($section)->findorfail($id);
        while ($item->order_column != $target_order) {
            $item->order_column > $target_order ? $item->moveOrderUp() : $item->moveOrderDown();
        }
        ClearCash::flush('dynamic_items');
        return $this->index($section);
    }

    public function sections()
    {
        return ['data' => DynamicSection::select(['id', 'name', 'location'])->get()->unique('name')->values()];
    }
}
