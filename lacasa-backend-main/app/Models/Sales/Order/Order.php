<?php

namespace App\Models\Sales\Order;

use App\Mail\User\Order\Created as UserOrderCreatedMail;
use App\Models\Sales\Cart\Cart;
use App\Models\Sales\Cart\CartItem;
use App\Models\Sales\Shipping\Shipment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Mail;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Order extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $guarded = false;

    protected $casts = [
        'paymob_response' => 'array',
    ];

    protected $attributes = [
        'status' => 'Pending Confirmation',
    ];

    public static function boot()
    {
        parent::boot();
        self::created(function ($model) {
            // Send email on model creation
            $model->sendOrderCreatedEmails();
        });

        self::replicating(function ($model) {
            // Send email before model replication
            $model->sendOrderCreatedEmails();
        });
    }

     public function sendOrderCreatedEmails()
     {
         try {
             // Send mail to user
             \Mail::to($this->user->email)->send(new UserOrderCreatedMail($this));
             // Send mail to admin
             \Mail::to('shop@lacasa-egy.com')->send(new UserOrderCreatedMail($this));
         }catch (\Exception $e){
             return false;
         }
     }

    public function onReplicated()
    {
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function cartable(): BelongsTo
    {
        return $this->morphOne(Cart::class, 'orderable');
    }

    public function items()
    {
        return $this->hasManyThrough(CartItem::class, Cart::class, 'orderable_id');
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

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
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

    // Scopes and filters
    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        // return $query->whereHas('Order', function($query) use($date){
        return $query->whereDate('created_at', '<=', Carbon::parse($date));
        // });
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return $query->whereDate('created_at', '>=', Carbon::parse($date));
    }

    public function scopeVendorFilter(Builder $query, $vendor_id): Builder
    {
        return $query->whereHas('cart.items', function ($query) use ($vendor_id) {
            $query->whereHas('product', function ($query) use ($vendor_id) {
                $query->whereHas('vendor', function ($query) use ($vendor_id) {
                    $query->whereVendorId($vendor_id);
                });
            });
        });
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
