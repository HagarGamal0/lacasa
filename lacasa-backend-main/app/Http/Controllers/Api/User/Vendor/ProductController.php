<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Vendor\Product\Create;
use App\Http\Requests\User\Vendor\Product\Update;
use App\Http\Resources\Product\Product as ProductResource;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Catalog\Product\Attribute;
use App\Models\Catalog\Product\Product;
use Auth;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Storage;
use Str;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        // return new ProductCollection(Auth::user()->products()->paginate());
        return $products = new ProductCollection(QueryBuilder::for(Auth::user()->products())
          // ->where('status', 1)
          // ->where('parent_id', 0)
          ->allowedIncludes('categories')
          ->allowedFilters([
              AllowedFilter::Exact('id'),
              'name',
              'featured',
              'status',
              AllowedFilter::scope('price_between'),
              AllowedFilter::scope('is_sale'),
              AllowedFilter::scope('category'),
          ])
           ->allowedSorts([
               AllowedSort::field('new', 'created_at'),
               'name',
               AllowedSort::field('price', 'price_after_sale'),
           ])
          ->paginate());
    }

    public function show($id)
    {
        return new ProductResource(QueryBuilder::for(Auth::user()->products())
          ->allowedIncludes('categories')
          ->find($id)
        );
    }

    public function store(Create $request)
    {
        // return $request;
        // return $request->validated();
        $product = collect($request->validated())->except(['categories', 'images', 'categories', 'attributes'])->toArray();
        $product = Auth::user()->products()->create($product);
        // return $request;
        foreach ($request->file('images') as $image) {
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/product_images/' . $fileName, file_get_contents($image), 'public');
            $product->images()->create(['url' => Storage::url('public/product_images/' . $fileName), 'description' => 'Product Image']);
        }
        $product->categories()->sync($request->validated()['categories']);
        if (isset($request->validated()['attributes'])) {
            foreach ($request->validated()['attributes'] as $attribute) {
                $created_attribute = Attribute::updateOrCreate(['name' => $attribute['name']]);
                $values = $attribute['values'];
                foreach ($values as $value) {
                    // return $value;
                    $val = $created_attribute->values()->updateOrCreate([
                        'value' => $value['title'],
                    ]);

                    $product->attribute_values()->attach($val, [
                        'price' => isset($value['price']) ? $value['price'] : null,
                        'price_after_sale' => isset($value['price_after_sale']) ? $value['price_after_sale'] : null,
                    ]);
                }
                $product->update(['type' => 'variant']);
            }
            if (isset($request->validated()['tags'])) {
                $selected_tags = collect();
                foreach ($request->validated()['tags'] as $tag) {
                    $selected_tag = Tag::firstorCreate(['name' => $tag['name']]);
                    $selected_tags->push($selected_tag->id);
                }
                $product->syncWithoutDetaching($selected_tags);
            }
            // return $product->attribute_values;
        }

        // Publish Product // TEMP
        // $product->update(['status' => 'Published']);

        return new ProductResource($product);
    }

    public function update($id, Update $request)
    {
        $product = collect($request->validated())->except(['categories', 'images', 'categories', 'deleted_images', 'attributes', 'tags'])->toArray();
        $product = Auth::user()->products()->findorfail($id)->update($product);
        $product = Auth::user()->products()->find($id);
        // return $request;
        if ($request->file('images')) {
            foreach ($request->file('images') as $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/product_images/' . $fileName, file_get_contents($image), 'public');
                $product->images()->create(['url' => Storage::url('public/product_images/' . $fileName), 'description' => 'Product Image']);
            }
        }
        if (isset($request->validated()['deleted_images'])) {
            if (count($request->validated()['deleted_images']) >= $product->images()->count()) {
                throw ValidationException::withMessages([
                    'deleted_images' => 'Product must to have at least one image.',
                ]);
            }
            foreach ($request->validated()['deleted_images'] as $image) {
                // return $image;
                $product->images()->find($image)->delete();
            }
        }
        if ($request->file('categories')) {
            $product->categories()->sync($request->validated()['categories']);
        }
        // return $request->validated()['attributes']->toArray();
        if (isset($request->validated()['attributes'])) {
            $product->attribute_values()->detach();
            foreach ($request->validated()['attributes'] as $attribute) {
                $created_attribute = Attribute::updateOrCreate(['name' => $attribute['name']]);
                $values = $attribute['values'];
                foreach ($values as $value) {
                    $val = $created_attribute->values()->updateOrCreate(['value' => $value['title']]);
                    // $product->attribute_values()->attach($val);
                    $product->attribute_values()->attach($val, [
                        'price' => isset($value['price']) ? $value['price'] : null,
                        'price_after_sale' => isset($value['price_after_sale']) ? $value['price_after_sale'] : null,
                    ]);
                }
                $product->update(['type' => 'variant']);
            }
        }
        if (isset($request->validated()['tags'])) {
            $selected_tags = collect();
            foreach ($request->validated()['tags'] as $tag) {
                $selected_tag = Tag::firstorCreate(['name' => $tag['name']]);
                $selected_tags->push($selected_tag->id);
            }
            $product->tags()->sync($selected_tags);
        }

        return new ProductResource($product);
    }

    public function destroy($id)
    {
        return Auth::user()->products()->find($id)->update([
            'status' => 'Draft',
        ]);
    }
}
