<?php


namespace App\Http\Controllers\Api\Catalog\Product;

// use Cviebrock\EloquentSluggable\Services\SlugService;
use App\Http\Helpers\ViewsSort;
use DB;
use App\Models\User\User;
use App\Models\Catalog\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Imports\ProductImport;
use App\Http\Helpers\RandomSort;
use App\Models\Catalog\Category;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedSort;
use Illuminate\Support\Facades\Cache;
use Spatie\QueryBuilder\Enums\SortDirection;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Models\Catalog\Product\Product;
use App\Http\Requests\Product\BulkUpdate;
use App\Models\Catalog\Product\Attribute;
use App\Http\Requests\Product\RepriceRequest;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\User\Vendor\Product\Create;
use App\Http\Requests\User\Vendor\Product\Update;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Catalog\Product\ProductTranslation;
use App\Http\Resources\Product\Product as ProductResource;
use Illuminate\Support\Facades\Artisan;
use App\Traits\ClearCash;
use App\Http\Helpers\ProductSlugs;


class ProductController extends Controller
{
    public $local;

    public function __construct()
    {
        // $this->middleware(['TrafficMonitor'])->only(['show']);
        //    $this->middleware(['auth:sanctum'])->except(['index', 'show', 'showSimilar']);
        $this->local = app()->getLocale();
    }


    public function show48h(Request $request)
    {

    $slugs = ProductSlugs::getSlugs48h(); // Get slugs from helper

    $products = Product::whereIn('slug', $slugs)
     ->with(['activities', 'shipping_profile', 'categories', 'vendor', 'tags', 'approved_reviews'])
        ->get();

    // Check if any products exist
    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found for the provided slugs.'], 404);
    }

    // Increment clicks for each product
    foreach ($products as $product) {
        $product->increment('clicks');
    }
    
    // Return the product data as resources
    return new ProductResource($product);
}
public function showBundle(Request $request)
    {

      $slugs = ProductSlugs::getSlugsBundle();
      
      $products = Cache::remember('products_bundle_' . implode('_', $slugs), 60, function() use ($slugs) {
        return Product::whereIn('slug', $slugs)
            ->with(['activities', 'shipping_profile', 'categories', 'vendor', 'tags', 'approved_reviews'])
            ->get();
    });

    // Check if any products exist
    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found for the provided slugs.'], 404);
    }

    // Increment clicks for each product
    foreach ($products as $product) {
        $product->increment('clicks');
    }
    
    \Log::info('Fetched products:', $products->toArray());

    // Return the product data as resources
    return new ProductResource($product);
}

public function showFreeShipping(Request $request)
{
    $slugs = ProductSlugs::getFreeShipping();

    $products = Cache::remember('products_bundle_' . implode('_', $slugs), 60, function() use ($slugs) {
        return Product::whereIn('slug', $slugs)
            ->with(['activities']) // Load only necessary relationships
            ->get();
    });

    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found for the provided slugs.'], 404);
    }

    foreach ($products as $product) {
        $product->increment('clicks');
    }
    
    \Log::info('Fetched products:', $products->pluck('slug')->toArray()); // Log only product IDs
    
    return new ProductResource($product); // Return all products
}






    public function index(Request $request)
    {
        // return $request;
        $pagination = $request['paginate'] ?: '8';
        $cacheKey = md5(serialize($request->all()));
        $cachedResponse = Cache::remember("products_{$cacheKey}_{$this->local}", 60 * 30, function () use ($request, $pagination) {
            $customSort = AllowedSort::custom('views', new ViewsSort())->defaultDirection(SortDirection::DESCENDING);
            $products = QueryBuilder::for(Product::class)
                ->allowedFilters([
                    'featured',
                    AllowedFilter::scope('name', 'name'),
                    AllowedFilter::scope('search', 'search_filter'),
                    AllowedFilter::scope('price_between'),
                    AllowedFilter::scope('is_sale'),
                    AllowedFilter::scope('is_free_shipping'),
                    AllowedFilter::scope('is_flash_free_shipping'),
                    AllowedFilter::scope('category'),
                    AllowedFilter::scope('vendors'),
                    AllowedFilter::exact('vendor.name'),
                    'shipping_profile_id',
                    'sku',
                    'brand',
                    AllowedFilter::exact('tags.name'),
                    AllowedFilter::partial('status')/*->default('Published')*/,
                    AllowedFilter::partial('vendor.vendor.status')/*->default('Active')*/,
                    AllowedFilter::exact('stock'),
                    AllowedFilter::exact('id'),
                    AllowedFilter::exact('vendor_id'),
                    AllowedFilter::scope('products', 'special_products'),
                    AllowedFilter::scope('custom_products', 'custom_products'),
                ])
                ->defaultSort($customSort,'-featured', '-id')
                ->defaultSorts([])
                ->allowedSorts([
                    AllowedSort::field('featured', 'featured'),
                    AllowedSort::field('new', 'created_at'),
                    'name',
                    AllowedSort::field('price', 'price_after_sale'),
                    $customSort,
                    AllowedSort::custom('random', new RandomSort(), 'random'),
                    AllowedSort::field('sales', 'sales_count'),
                ])
                ->paginate($pagination);

            ($products = new ProductCollection($products))->additional(['meta' => [
                'selected_category' => $request['find']['category'] ?? null,
                'price_range' => [
                    'min' => 0,
                    'max' => 500000,
                ],
            ]]);

            return $products;
        });

        return $cachedResponse;
    }

    public function import(Request $request)
    {
        Excel::import(new ProductImport(), request()->file('file'), null, \Maatwebsite\Excel\Excel::CSV);
        ClearCash::flush('products');
        return [
            'code' => 200,
            'status' => 'success',
        ];
    }

    public function show(Request $request, $id)
    {

        $product = Product::slug($id)
            ->with(['activities', 'shipping_profile', 'categories', 'vendor', 'tags', 'approved_reviews'])
            ->firstOrFail() // Use firstOrFail to handle missing products
            ->first();
//        $product = Cache::remember("products_{$id}_{$this->local}", 60 * 30, function () use ($id) {
//            return Product::slug($id)->with(['activities', 'shipping_profile', 'categories', 'vendor', 'tags', 'approved_reviews'])->first();
//        });
        $product->increment('clicks');
        return new ProductResource($product);
    }

    public function showSimilar($id)
    {
        $productCaches = Cache::remember("Similar_{$id}_{$this->local}", 60 * 30, function () use ($id) {
            $product = Product::slug($id)->first();
            if ($product) {
                $cats = $product->categories->pluck('id');
            } else {
                $cats = Category::inRandomOrder()->limit(3)->pluck('id');
            }
            return new ProductCollection(Product::where('discount', '>', 0)
            ->where('status', 'published')
            ->whereRaw('price != price_after_sale')
            ->whereHas('categories', function ($query) use ($cats) {
                $query->whereIn('id', $cats);
            })->limit(4)->get());
        });

        return $productCaches;

    }

    public function store(Create $request)
    {
        if (!isset($request['vendor_id'])) {
            throw ValidationException::withMessages([
                'vendor_id' => 'Vendor field is required',
            ]);
        }
        if (!User::isVendor()->whereId($request['vendor_id'])->first()) {
            throw ValidationException::withMessages([
                'vendor_id' => 'invalid vendor',
            ]);
        }
        $data = $request->validated();
        if ('percentage' === $data['discount_type']) {
            $data['price_after_sale'] = $data['price'] - $data['price'] * $data['discount'] / 100;
        } else {
            $data['price_after_sale'] = $data['price'] - $data['discount'];
        }
        $dataCreate = collect($data)->except(['categories', 'images', 'categories', 'attributes', 'tags', 'name', 'description', 'short_description'])->toArray();
        $dataCreate['name'] = $data['name']['en'];

        $dataCreate['status'] = 'Published';
        $product = User::find($request['vendor_id'])->products()->create($dataCreate);
        foreach ($data['name'] as $lang => $name) {
            $product->translateOrNew($lang)->name = $name;
        }
        foreach ($data['description'] as $lang => $description) {
            $product->translateOrNew($lang)->description = $description;
        }
        foreach ($data['short_description'] as $lang => $short_description) {
            $product->translateOrNew($lang)->short_description = $short_description;
        }
        foreach ($request->input('meta_description',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_description = $value;
        }
        foreach ($request->input('meta_title',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_title = $value;
        }
        foreach ($request->input('meta_keywords',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_keywords = $value;
        }


        foreach ($request->file('images') as $image) {
            $fileName = time() . '-' . $image->getClientOriginalName();
            $image = \Storage::put('public/products/' . $product->id . '/' . $fileName, file_get_contents($image), 'public');
            $product->images()->create(['url' => \Storage::url('public/products/' . $product->id . '/' . $fileName), 'description' => 'Product Image']);
        }
        $product->categories()->sync($request->validated()['categories']);

        if (isset($request->validated()['attributes'])) {
            foreach ($request->validated()['attributes'] as $attribute) {
                $created_attribute = Attribute::updateOrCreate(['name' => $attribute['name']]);
                $values = $attribute['values'];
                foreach ($values as $value) {
                    $val = $created_attribute->values()->updateOrCreate(['value' => $value['title']]);
                    $product->attribute_values()->attach($val, [
                        'price' => $value['price'] ?? null,
                        'price_after_sale' => $value['price_after_sale'] ?? null,
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
            $product->tags()->syncWithoutDetaching($selected_tags);
            foreach ($product->categories as $category) {
                $category->tags()->syncWithoutDetaching($selected_tags);
            }
        }


        $product->save();
        ClearCash::flush('products');
        return new ProductResource($product);
    }

    // public function update($id, Update $request)
    public function update(Update $request, $id)
    {
        $product = Product::slug($id)->first();
        if (!isset($request['vendor_id'])) {
            throw ValidationException::withMessages([
                'vendor_id' => 'Vendor field is required',
            ]);
        }
        if (!User::isVendor()->whereId($request['vendor_id'])->first()) {
            throw ValidationException::withMessages([
                'vendor_id' => 'invalid vendor',
            ]);
        }
        $data = $request->all();


        $updateData = collect($data)->except(['categories', 'images', 'categories', 'attributes', 'deleted_images', 'tags', 'name', 'description', 'short_description', 'update_slug'])->toArray();
        $product->update($updateData);
        if ($data['update_slug'] == 1) {
            $product->generateSlug();
        }


        if (isset($request->validated()['deleted_images'])) {
            // if (\count($request->validated()['deleted_images']) >= $product->images()->count()) {
            //     throw ValidationException::withMessages([
            //         'deleted_images' => 'Product must have at least one image.',
            //     ]);
            // }
            foreach ($request->validated()['deleted_images'] as $image) {
                $product->images()->find($image)->delete();
            }
        }

        if ($request->file('images')) {
            foreach ($request->file('images') as $image) {
                $fileName = \Str::random(6) . '-' . $image->getClientOriginalName();
                $image = \Storage::put('public/products/' . $product->id . '/' . $fileName, file_get_contents($image), 'public');
                $product->images()->create(['url' => \Storage::url('public/products/' . $product->id . '/' . $fileName), 'description' => 'Product Image']);
            }
        }

        $product->categories()->sync($request->validated()['categories']);

        if (isset($request->validated()['attributes'])) {
            $product->attribute_values()->detach();
            foreach ($request->validated()['attributes'] as $attribute) {
                $created_attribute = Attribute::updateOrCreate(['name' => $attribute['name']]);
                $values = $attribute['values'];
                foreach ($values as $value) {
                    $val = $created_attribute->values()->updateOrCreate(['value' => $value['title']]);
                    $product->attribute_values()->attach($val, [
                        'price' => $value['price'] ?? null,
                        'price_after_sale' => $value['price_after_sale'] ?? null,
                    ]);
                }
                $product->update(['type' => 'variant']);
            }
        } else {
            $product->attribute_values()->detach();
        }
        if (isset($request->validated()['tags'])) {
            $selected_tags = collect();
            foreach ($request->validated()['tags'] as $tag) {
                $selected_tag = Tag::firstorCreate(['name' => $tag['name']]);
                $selected_tags->push($selected_tag->id);
            }
            $product->tags()->sync($selected_tags);
            foreach ($product->categories as $category) {
                $category->tags()->sync($selected_tags);
            }
        }


        foreach ($data['name'] as $lang => $name) {
            $product->translateOrNew($lang)->name = $name;
        }

        foreach ($data['description'] as $lang => $description) {
            $product->translateOrNew($lang)->description = $description;
        }
        foreach ($data['short_description'] as $lang => $short_description) {
            $product->translateOrNew($lang)->short_description = $short_description;
        }

        foreach ($request->input('meta_description',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_description = $value;
        }
        foreach ($request->input('meta_title',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_title = $value;
        }
        foreach ($request->input('meta_keywords',[]) as $lang => $value) {
            $product->translateOrNew($lang)->meta_keywords = $value;
        }

        $product->save();
        ClearCash::flush('products');
        return new ProductResource($product);
    }


    public function reprice(RepriceRequest $request, $vendor_id, $category = "")
    {
        $reprice = $request->validated();
        $products = Product::whereVendorId($vendor_id)->when($category, function ($query, $category) {
            if ($category != "") {
                $query->Category($category);
            }

        })->get();


        foreach ($products as $product) {
            if (isset($reprice['plus']) && $reprice['plus'] > 0) {
                $product->update([
                    'price' => $product->price + ($product->price * $reprice['plus'] / 100),
                    'discount' => $product->discount + ($product->discount * $reprice['plus'] / 100),
                    'price_after_sale' => $product->discount + ($product->discount * $reprice['plus'] / 100),
                ]);
                $product->attribute_values()->wherePivot('price_after_sale', '!=', null)->update(['price_after_sale' => \DB::raw('price_after_sale + (price_after_sale*' . $reprice['plus'] . '/100)')]);
            }
            if (isset($reprice['minus']) && $reprice['minus'] > 0) {
                $product->update([
                    'price' => $product->price - ($product->price * $reprice['minus'] / 100),
                    'discount' => $product->discount - ($product->discount * $reprice['minus'] / 100),
                    'price_after_sale' => $product->discount - ($product->discount * $reprice['minus'] / 100),
                ]);

                $product->attribute_values()->wherePivot('price_after_sale', '!=', null)->update(['price_after_sale' => \DB::raw('price_after_sale - (price_after_sale*' . $reprice['minus'] . '/100)')]);
            }
        }
        ClearCash::flush('products');
        return ProductResource::collection(User::find($vendor_id)->products()->get());
    }

    public function bulkUpdate(BulkUpdate $request)
    {
        $items = $request->validated();
        if ('products' === $items['select_by']) {
            $products = $items['products'];
            $items['products'] = $items['products'];
        } else {
            $products = Product::whereVendorId($items['vendor_id'])->pluck('id');
            $items['products'] = $products;
        }
        $query = collect($items)->only(['vendor_id', 'status', 'featured'])->toArray();
        Product::whereIn('id', $products)->update($query);
        if (isset($items['to_vendor_id']) && $items['to_vendor_id']) {
            Product::whereIn('id', $products)->update(['vendor_id' => $items['to_vendor_id']]);
        }
        $products = Product::whereIn('id', $products)->with('categories')->get();
        if (isset($items['categories']) && $items['categories']) {
            foreach ($products as $product) {
                $product->categories()->syncWithoutDetaching($items['categories']);
                // return $items['categories'];
            }
        }

        if (isset($request->validated()['fixed_equation']) && $request->validated()['fixed_equation']) {
            if ($request->numberType == 0) {
                $pricesql = \DB::raw('price - ' . $request->validated()['fixed_equation'] . '');
                $sql = \DB::raw('price_after_sale - ' . $request->validated()['fixed_equation'] . '');
            } else {
                $pricesql = \DB::raw('price + ' . $request->validated()['fixed_equation'] . '');
                $sql = \DB::raw('price_after_sale + ' . $request->validated()['fixed_equation'] . '');
            }
            Product::whereIn('id', $items['products'])->update(['price' => $pricesql]);
            $products = Product::whereIn('id', $items['products'])->get();
            foreach ($products as $product) {
                $product->attribute_values()->wherePivot('price_after_sale', '!=', null)->update(['price_after_sale' => $sql]);
            }
        }
        ClearCash::flush('products');
        return ProductResource::collection($products->fresh());

    }

    public function duplicate(Request $request, Product $product)
    {
        $duplicate = $product->replicate();
        $duplicate->status = 'Draft';
        // $duplicate->slug = '';

        $duplicate->save();

        $translateDuplicates = $product->getTranslationsArray();
        foreach ($translateDuplicates as $lang => $translateDuplicate) {
            $duplicate->translateOrNew($lang)->name = $translateDuplicate['name'];
            $duplicate->translateOrNew($lang)->description = $translateDuplicate['description'];
            $duplicate->translateOrNew($lang)->short_description = $translateDuplicate['short_description'];
        }
        $duplicate->save();

        foreach ($product->images as $image) {
            $duplicateImage = $image->replicate();
            $duplicateImage->imageable_id = $duplicate->id;
            $duplicateImage->save();
        }
        foreach ($product->attribute_values as $attribute) {
            $duplicateAttribute = $attribute->pivot->replicate();
            $duplicateAttribute->product_id = $duplicate->id;
            $duplicateAttribute->save();
        }

        ClearCash::flush('products');
        return new ProductResource($duplicate->fresh());
    }

}

