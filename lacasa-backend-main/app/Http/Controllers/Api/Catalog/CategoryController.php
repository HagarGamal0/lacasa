<?php

namespace App\Http\Controllers\Api\Catalog;

use Str;
use Storage;
use App\Models\Catalog\Category;
use App\Enums\ShippingProfileType;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Models\Catalog\CategoryTranslation;
use App\Http\Requests\Product\Category\Create;
use App\Http\Requests\Product\Category\Update;
use App\Http\Resources\Product\CategoryResource;

use App\Traits\ClearCash;

class CategoryController extends Controller
{
    public function index()
    {
        $local =app()->getLocale();
        $categories = Cache::remember("categories_{$local}", 60 * 30, function () {
            return CategoryResource::collection(Category::whereSlug('shop-by-department')->first()->childs()->ordered()->with(['childs', 'tags'])->get())->toJson();
        });
        $categories = json_decode($categories);
        return ["data" => $categories];
    }

    public function moveOrder($id, $target_order)
    {
        $category = Category::find($id);
        while ($category->order_column != $target_order) {
            $category->order_column > $target_order ? $category->moveOrderUp() : $category->moveOrderDown();
        }
        ClearCash::flush('categories');
        return $this->index();
    }

    public function show($id)
    {

        $categoryArray = explode('*', $id);
        if (count($categoryArray) == 1) {
            return new CategoryResource(Category::with('childs')->where('slug',$id)
                ->orWhere('id',$id)->first());
        }
         return CategoryResource::collection(Category::with('childs')->whereIn('slug',$categoryArray)
             ->orWhereIn('id',$categoryArray)
             ->get());
    }

    public function store(Create $request)
    {

        $data = $request->validated();
        ! isset($data['parent_id']) ? $data['parent_id'] = 69 : $data['parent_id'];
        $data['parent_id'] == '' ? $data['parent_id'] = 69 : $data['parent_id'];

        $data['slug'] = Str::slug($data['name']['en']);
        $category = Category::create([
            'parent_id' =>  $data['parent_id'],
            'slug' =>  $data['slug'],
            'show_in_menu' => $data['show_in_menu'],
        ]);
        //logo
        if ($request->has('image')) {
            $image = $request->file('image');
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
            $category['image'] = Storage::url('public/category_images/' . $fileName);
        }
        //banner
        foreach ($data['name'] as $lang => $name) {
            $category->translateOrNew($lang)->name = $name;
        }
        if ($request->file('banner')) {
            $images = $request->file('banner');
            foreach ($images as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
                $category->translateOrNew($lang)->banner = Storage::url('public/category_images/' . $fileName);
            }
        }
        $category->save();
        $init_shipping = app('App\Http\Controllers\Api\Catalog\Product\ShippingFeeController')->intialize_shipping($category->id);

        ClearCash::flush('categories');
        return new CategoryResource($category);
    }

    public function update(Update $request, Category $category)
    {
        $data = $request->all();
        $data['slug'] = Str::slug($data['name']['en']);
      ! isset($data['parent_id']) ? $data['parent_id'] = 69 : $data['parent_id'];
        $data['parent_id'] == '' ? $data['parent_id'] = 69 : $data['parent_id'];
        $category->update([
            'parent_id' =>$data['parent_id'],
            'slug' =>  $data['slug'],
            'show_in_menu' => $data['show_in_menu'],
        ]);


        if ($request->file('image')) {
            $image = $request->file('image');
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
            $data['image'] = Storage::url('public/category_images/' . $fileName);
        }
        if ($request->file('banner')) {
            $images = $request->file('banner');
            foreach ($images as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
                $category->translateOrNew($lang)->banner = Storage::url('public/category_images/' . $fileName);
            }
        }
        foreach ($data['name'] as $lang => $name) {
            $category->translateOrNew($lang)->name = $name;
        }
        $category->save();
        ClearCash::flush('categories');
        return new CategoryResource($category);
    }

    public function destroy($id)
    {
        $trash = CategoryTranslation::firstOrCreate(['name' => 'Trash']);
        Category::find($id)->update(['parent_id' => $trash->id]);
        ClearCash::flush('categories');
        return [
            'status' => __('lang.success'),
            'code' => '200',
            'message' =>__('lang.Category_deleted'),
        ];

    }
}
