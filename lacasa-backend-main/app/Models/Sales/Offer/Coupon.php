<?php

namespace App\Models\Sales\Offer;

use Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Coupon extends Model
{
    use HasFactory;

    protected $guarded = []; // Mark all attributes as fillable

    const FreeShippingCode = "FS24";
    const DC50Code    = "DC50";
    const LC3Code    = "LC3";
    const VALIU35Code = "valu35";
    const FreeShippingCategoryMathId = ['27', '209', '210', '211', '213', '214', '217', '24', '26'];

    //Relationships
    public function orders()
    {
        return $this->hasMany(\App\Models\Sales\Order\Order::class);
    }

    public function categories()
    {
        return $this->belongsToMany(\App\Models\Catalog\Category::class, 'coupon_category');
    }

    public function vendors()
    {
        return $this->belongsToMany(\App\Models\User\User::class, 'coupon_vendor', 'coupon_id', 'vendor_id')->withPivot(['exclude_products', 'exclude_categories']);
    }

    public function products()
    {
        return $this->belongsToMany(\App\Models\Catalog\Product\Product::class, 'coupon_product');
    }
    // End Relationships

    // Custom Attributes
    public function getStatusAttribute()
    {
        if (($this->usage_type == 'multiple' && ($this->no_of_usage >= $this->orders()->whereUserId(Auth::id())->count()) && Carbon::parse($this->expiry)->gt(Carbon::now()) > 0) || ($this->usage_type == 'single' && $this->orders()->whereUserId(Auth::id())->count() == 0 && (Carbon::parse($this->expiry)->gt(Carbon::now()) > 0))) {
            return 'Valid';
        } else {
            return 'Expired';
        }
    }
    // End of Custom Attributes
}
