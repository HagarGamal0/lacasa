<?php

namespace App\Models\Sales\Order;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OldOrder extends Model
{
    use HasFactory,LogsActivity;

    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function products()
    {
        return $this->belongsToMany(\App\Models\Catalog\Product\Product::class, 'old_orders_products', 'order_id')
        ->withPivot(['quantity', 'price', 'shipping_fees', 'subtotal', 'status', 'attributes', 'commission', 'vendor_revenue', 'purchase_price', 'coupon_discount', 'original_subtotal', 'flash_sale_discount', 'shipping_discount', 'shipping_notes']); // ->using(OrderProduct::class);
    }

    public function payment_method()
    {
        return $this->belongsTo(\App\Models\PaymentMethod::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User\User::class);
    }

    public function orange_voucher()
    {
        return $this->belongsTo(\App\Models\Sales\Offer\OrangeVoucher::class, 'orange_voucher_id');
    }

    public function address()
    {
        return $this->belongsTo(\App\Models\User\AddressBook::class, 'address_book_id');
    }

    public function coupon()
    {
        return $this->belongsTo(\App\Models\Sales\Offer\Coupon::class);
    }

    public function status_history()
    {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    public function shipments()
    {
        return $this->hasMany(\App\Models\Sales\Shipping\Shipment::class, 'order_id');
    }
    // End of Relationships

    // Scopes and filters
  public function scopeValid($query)
  {
      $query->where('payment_status', 'Cash On Delivery')->orwhere('payment_status', 'Paid');
  }

   public function scopeIsValid(Builder $query, $value): Builder
   {
       if ($value == 'valid') {
           return $query->where('payment_status', 'Cash On Delivery')->orwhere('payment_status', 'Paid');
       } elseif ($value == 'invalid') {
           return $query->where('payment_status', 'Unpaid');
       } else {
           return $query;
       }
   }

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

   public function scopeProductsStatus(Builder $query, $status): Builder
   {
       return $query->whereHas('products', function ($query) use ($status) {
           $query->where('orders_products.status', $status);
       });
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
   // End of Scopes and filters

   // Init logs
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logAll()
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs();
        // Chain fluent methods for configuration options
    }
    // End of init logs
}
