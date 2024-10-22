<?php

namespace App\Http\Controllers\Api\Catalog\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductReviewRequest;
use App\Http\Requests\UpdateProductReviewRequest;
use App\Http\Resources\Product\Review as ReviewResource;
use App\Models\Catalog\Product\Product;
use App\Models\Catalog\Product\Review;
use App\Models\Sales\Cart\Cart;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function index()
    {
        return ReviewResource::collection(QueryBuilder::for(Review::with('product'))
            ->allowedFilters([
                AllowedFilter::exact('status')->default('pending'),
                AllowedFilter::exact('product_id'),
            ])->paginate());
    }

    public function store(CreateProductReviewRequest $product, Request $request)
    {
        $valid = $request->validated();

        if (\Auth::user()->reviews()->whereProductId($product->id)->first()) {
            $review_id = \Auth::user()->reviews()->whereProductId($product->id)->first()->id;
            $this->update($product, $review_id, $request);
        } else {
            $product->reviews()->create([
                'product_id' => $product->id,
                'user_id' => \Auth::id(),
                'tag' => $product->vendor_id === \Auth::id() ? 'Seller' : (Cart::whereStatus('order')->whereHas('order', function ($query) {
                    $query->whereUserId(\Auth::id());
                })->whereHas('items', function ($query) use ($product) {
                    $query->whereProductId($product->id);
                })->first() ? 'Purchase Verified' : ''),
                'title' => $valid['title'],
                'description' => $valid['description'],
                'stars' => $valid['stars'],
            ]);
        }

        // Add Images if exists;
        if ($request->file('images')) {
            $review = \Auth::user()->reviews()->whereProductId($product->id)->first();
            $review->images()->delete();
            foreach ($request->file('images') as $image) {
                $fileName = \Str::random(6) . '-' . $image->getClientOriginalName();
                $image = \Storage::put('public/products/' . $product->id . '/reviews/' . $fileName, file_get_contents($image), 'public');
                $review->images()->create(['url' => \Storage::url('public/products/' . $product->id . '/reviews/' . $fileName), 'description' => 'Product Review Image']);
            }
        }


        // END TEMP
        return [
            'data' => [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.Message_error_end_temp'),

            ],
        ];
    }

    public function update(UpdateProductReviewRequest $product, $id, $request)
    {
        $valid = $request->validated();
        $product->reviews()->find($id)->update([
            'title' => $valid['title'],
            'description' => $valid['description'],
            'stars' => $valid['stars'],
            'status' => 'pending',
        ]);

        return [
            'data' => [
                'code' => 200,
                'status' =>  __('lang.success'),
                'message' =>  __('lang.Message_error_end_temp'),
            ],
        ];
    }

    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);
        return [
            'data' => [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.review_appear_product'),
            ],
        ];
    }

    public function reject(Review $review)
    {
        $review->update(['status' => 'rejected']);
        return [
            'data' => [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.review_rejected_product'),
            ],
        ];
    }

    public function destroy($id)
    {
        Review::find($id)->delete();
        return [
            'data' => [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.review_Deleted'),
            ],
        ];
    }
}
