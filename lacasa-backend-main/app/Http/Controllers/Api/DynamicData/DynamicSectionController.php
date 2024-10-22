<?php

namespace App\Http\Controllers\Api\DynamicData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DynamicData\CreateItem as Create;
use App\Http\Requests\DynamicData\UpdateItem as Update;
use App\Http\Resources\DynamicData\DynamicInput as DynamicInputResource;
use App\Http\Resources\DynamicData\DynamicSection as DynamicSectionResource;
use App\Models\DynamicData\DynamicSection;
use Storage;

class DynamicSectionController extends Controller
{
    public function index()
    {
        return DynamicSectionResource::collection(DynamicSection::all());
    }

    public function show($id)
    {
        if (is_numeric($id)) {
            return new DynamicSectionResource(DynamicSection::find($id));
        } else {
            return new DynamicSectionResource(DynamicSection::whereName($id)->first());
        }
    }

    public function store(Create $request)
    {
        $item = DynamicSection::create($request->validated());

        return new DynamicSectionResource($item);
    }

    public function update(Update $request, $id)
    {
        $item = DynamicSection::find($id)->update($request->validated());
        $item = DynamicSection::find($id);

        return new DynamicSectionResource($item);
    }

    public function inputs($section)
    {
        return DynamicInputResource::collection(DynamicSection::whereName($section)->first()->inputs()->get());
    }

      // public function destroy(, $id)
      // {
      //   $item = DynamicSection::find($id);
      //   $image = $item->image();
      //   if($image->first())
      //   {
    //       $image_url = $image->url;
    //       Storage::delete($image_url);
    //       $image->delete();
      //   }
      //   $image = $item->mobile_image();
      //   if($image->first())
      //   {
    //       $image_url = $image->url;
    //       Storage::delete($image_url);
    //       $image->delete();
      //   }
      //   $item->delete();
      //   return response()->json([
    //     'code' => 202,
    //     'status' => 'success',
    //     'message' => 'Item Deleted'
      //   ], 202);
      // }

      // public function moveOrder(, $id,$target_order)
      // {
      //   $item = DynamicSection::findorfail($id);
      //   while($item->order_column != $target_order)
      //   {
    //     $item->order_column > $target_order ? $item->moveOrderUp() : $item->moveOrderDown();
      //   }
      //   return $this->index();
      // }

      // public function sections()
      // {
      //   return ['data' => DynamicSection::select(['id','name','location'])->get()->unique('name')->values()];
      // }
}
