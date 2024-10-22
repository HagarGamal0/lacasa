<?php

namespace App\Models\Sales\Order;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OldTempOrder extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function products()
    {
        return $this->belongsToMany(\App\Models\Catalog\Product\Product::class, 'old_temp_orders_products', 'temp_order_id')->withPivot(['quantity', 'price', 'shipping_fees', 'subtotal', 'status', 'attributes', 'commission', 'vendor_revenue', 'purchase_price', 'coupon_discount', 'original_subtotal', 'flash_sale_discount', 'shipping_discount', 'shipping_notes']);
    }

    public function payment_method()
    {
        return $this->belongsTo(\App\Models\PaymentMethod::class);
    }

    public function orange_voucher()
    {
        return $this->belongsTo(\App\Models\Sales\Offer\OrangeVoucher::class, 'orange_voucher_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User\User::class);
    }

    public function address()
    {
        return $this->belongsTo(\App\Models\User\AddressBook::class, 'address_book_id');
    }

    // public function status_history()
    // {
    //   return $this->hasMany(OrderStatusHistory::class, 'order_id');
    // }
    // End of Relationships
    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        return $query->whereDate('created_at', '<=', Carbon::parse($date));
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return $query->whereDate('created_at', '>=', Carbon::parse($date));
    }

    public function scopeTotalFrom(Builder $query, $total): Builder
    {
        return $query->where('total', '>=', $total);
    }

    public function scopeTotalTo(Builder $query, $total): Builder
    {
        return $query->where('total', '<=', $total);
    }

    public function scopeVendorFilter(Builder $query, $vendor_name): Builder
    {
        return $query->whereHas('products', function ($query) use ($vendor_name) {
            $query->whereHas('vendor', function ($query) use ($vendor_name) {
                $query->whereHas('vendor', function ($query) use ($vendor_name) {
                    $query->whereCompanyName($vendor_name);
                });
            });
        });
    }

    public function scopeProductFilter(Builder $query, $product_name): Builder
    {
        return $query->whereHas('products', function ($query) use ($product_name) {
            $query->where('name', 'like', '%' . $product_name . '%');
        });
    }
}
