<?php

namespace App\Http\Controllers\Api\User\Designer;

use DB;
use Str;
use Storage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Spatie\QueryBuilder\QueryBuilder;
use App\Enums\ProfessionalCategoryType;
use App\Models\User\Designer\DesignerCategory;
use App\Http\Requests\User\Designer\Category\Create;
use App\Http\Requests\User\Designer\Category\Update;
use App\Models\User\Designer\DesignerCategoryTranslation;
use App\Http\Resources\User\Designer\Category as CategoryResource;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        $cacheKey = md5(serialize($request->all()));
        // $categories = Cache::remember("designer_categories_{$cacheKey}", 60 * 30, function () use ($request, $pagination) {
        $categories = QueryBuilder::for(DesignerCategory::with(['childs']))
            ->allowedIncludes([
                'childs',
                'parent',
            ])
            ->allowedFilters([
                'type',
                'id',
            ])
            ->allowedSorts([
                'id',
            ])->paginate($pagination);

        return CategoryResource::collection($categories);
    }
    public function show($id, Request $request)
    {
        return new CategoryResource(QueryBuilder::for(DesignerCategory::with(['childs']))
            ->allowedFilters([
                'childs',
                'parent',
            ])
            ->allowedIncludes([
                'id',
            ])
            ->allowedSorts([
                'id',
            ])->findorfail($id));
    }

    public function store(Create $request)
    {
        $data = $request->validated();

        $data['type'] = intval($data['type']);
        $dataCreate = collect($data)->except(['name', 'description', 'image'])->toArray();
        $_category = DesignerCategory::create($dataCreate);

        foreach ($data['name'] as $lang => $name) {
            $_category->translateOrNew($lang)->name = $name;
        }

        // foreach ($data['description'] as $lang => $description) {
        //     $_category->translateOrNew($lang)->description = $description;
        // }

        if ($request->file('image')) {
            $images = $request->file('image');
            foreach ($images as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
                $_category->translateOrNew($lang)->image = Storage::url('public/category_images/' . $fileName);
            }
        }
        $_category->save();
        return $this->show($_category->id, $request);
    }

    public function update($id, Update $request)
    {
        $data = $request->validated();

        $data['type'] = intval($data['type']);

        $dataCreate = collect($data)->except(['name', 'description', 'image'])->toArray();

        $category = DesignerCategory::findOrFail($id);
        $category->update($dataCreate);
        foreach ($data['name'] as $lang => $name) {
            $category->translateOrNew($lang)->name = $name;
        }

        // foreach ($data['description'] as $lang => $description) {
        //     $category->translateOrNew($lang)->description = $description;
        // }

        if ($request->has('image')) {
            $images = $request->file('image');
            foreach ($images as $lang => $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/category_images/' . $fileName, file_get_contents($image), 'public');
                $category->translateOrNew($lang)->image = Storage::url('public/category_images/' . $fileName);
            }
        }

        $category->save();

        return $this->show($id, $request);
    }

    public function destroy($id)
    {
        $designerCategory = DesignerCategory::find($id);
        $designerCategory->delete();
        return [
            'status' =>  __('lang.success'),
            'code' => '200',
            'message' => __('lang.Delete Success'),
        ];
    }

    public function list()
    {
        $suppliers =  DesignerCategory::with(['childs'])->where('type', intval(ProfessionalCategoryType::Supplier))->get();
        $designers =  DesignerCategory::with(['childs'])->where('type', intval(ProfessionalCategoryType::Designer))->get();

        $data['suppliers'] = $suppliers ? CategoryResource::collection($suppliers) : null;
        $data['designers'] = $designers ?  CategoryResource::collection($designers) : null;
        return $data;
    }
}
