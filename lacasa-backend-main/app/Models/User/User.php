<?php

namespace App\Models\User;

use Carbon\Carbon;
use Hash;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Catalog\Product\Review;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    //     'phone',
    // ];
    protected $guarded = [];
    protected $guard_name = 'sanctum';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function vendor()
    {
        return $this->hasOne(Vendor::class);
    }

    public function designer()
    {
        return $this->hasOne(Designer::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeIsVendor($query)
    {
        return $query->has('vendor');
    }

    public function scopeIsDesigner($query)
    {
        return $query->has('Designer');
    }

    public function getUserTypeAttribute()
    {
        if ($this->vendor()->exists()) {
            $type = 'Vendor';
        } elseif ($this->designer()->exists()) {
            $type = 'Designer';
        } else {
            $type = 'Regular';
        }

        return $type;
    }

    public function is_Regular()
    {
        return $this->user_type == 'Regular' ? true : false;
    }
    public function is_vendor()
    {
        return $this->user_type == 'Vendor' ? true : false;
    }

    public function is_designer()
    {
        return $this->user_type == 'Designer' ? true : false;
    }

    public function addressbooks()
    {
        return $this->hasMany(AddressBook::class);
    }
    
    //
    //
    // public function scopeShippingAddress($query)
    // {
    //   return $query->whereHas(where('type', 'shipping');
    // }
    //

    public function getShippingAddressAttribute($query)
    {
        return $this->addressbooks()->where('type', 'shipping')->whereIsActive(1)->get();
    }

    public function getBillingAddressAttribute($query)
    {
        return $this->addressbooks()->where('type', 'billing')->whereIsActive(1)->get();
    }

    public function shipping_fees()
    {
        if ($this->is_vendor()) {
            return $this->hasMany(\App\Models\Sales\Shipping\ShippingFee::class, 'vendor_id');
        }
        // return [];
    }

    public function products()
    {
        return $this->hasMany(\App\Models\Catalog\Product\Product::class, 'vendor_id');
    }


    public function productsDom()
    {
        return $this->hasMany(\App\Models\Catalog\Product\dom\Product::class, 'vendor_id');
    }

    public function orders()
    {
        return $this->hasMany(\App\Models\Sales\Order\Order::class);
    }

    public function soldProductsCount()
    {
        // return \App\Models\Sales\Order\OrderProduct::whereHas('product', function (Builder $query) {
        //   $query->where('vendor_id', $this->id);
        // })->whereHas('order', function (Builder $query) {
        //   $query->valid();
        // })->count();
        return 0;
    }

    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        return $query->whereDate('created_at', '<=', Carbon::parse($date));
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return $query->whereDate('created_at', '>=', Carbon::parse($date));
    }

   public function getActivitylogOptions(): LogOptions
   {
       return LogOptions::defaults()
       ->logAll()
       ->logOnlyDirty()
       ->dontSubmitEmptyLogs();
       // Chain fluent methods for configuration options
   }

   public function orange_vouchers()
   {
       return $this->hasMany(\App\Models\Sales\Offer\OrangeVoucher::class);
   }
}
