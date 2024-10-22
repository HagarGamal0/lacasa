<?php

namespace App\Models\Sales\Order;

use App\Models\Sales\Cart\Cart;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Models\Sales\Shipping\Shipment;
use Carbon\Carbon;

class DraftOrder extends Model
{
    use HasFactory, LogsActivity;
    protected $guarded = false;
    protected $casts = [
        'paymob_response' => 'array',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
    
    public function cartable(): BelongsTo
    {
        return $this->morphOne(Cart::class, 'orderable');
    }
    
    public function payment_method(): BelongsTo
    {
        return $this->belongsTo(\App\Models\PaymentMethod::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User\AddressBook::class, 'address_book_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User\User::class);
    }

    public function getCommissionAttribute()
    {
        return $this->cart->items->sum('commission');
    }

    public function getVendorRevenueAttribute()
    {
        return $this->cart->items->sum('vendor_revenue');
    }

    public function setCommissionAttribute()
    {
        $this->attributes['commission'] = $this->commission;
        $this->attributes['vendor_revenue'] = $this->vendor_revenue;
    }

    public function setVendorRevenueAttribute()
    {
        $this->attributes['vendor_revenue'] = $this->vendor_revenue;
    } 
     public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }

    // Scopes and filters
    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        // return $query->whereHas('Order', function($query) use($date){
        return $query->whereDate('created_at', '<=', Carbon::parse($date));
        // });
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return
         $query->whereDate('created_at', '>=', Carbon::parse($date));
    }

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
