<?php

namespace App\Models\Catalog\Product;

use App\Models\Sales\Cart\Cart;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $guarded = false;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeApproved(Builder $query): void
    {
        $query->where('status', 'Approved');
    }

    public function getTagAttribute(): string
    {
        if ($this->product->vendor_id === $this->user_id) {
            return 'Seller';
        }
        if (Cart::whereStatus('order')->whereHas('order', function ($query) {
            $query->whereUserId($this->user_id);
        })->whereHas('items', function ($query) {
            $query->whereProductId($this->product->id);
        })->first()) {
            return 'Purchase Verified';
        }
        if ($this->user->roles->count() > 0) {
            return 'Lacasa Support';
        }

        return 'Lacasa User';
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
