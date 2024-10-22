<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressBook extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = [
        'default' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($address) {
            $address->address = $address->building_no . ' ' . $address->street . ' Apartment No.:' . $address->apartment_no . ' Floor No.' . $address->floor_no;
        });
        self::updating(function ($address) {
            $address->address = $address->building_no . ' ' . $address->street . ' Apartment No.:' . $address->apartment_no . ' Floor No.' . $address->floor_no;
        });
    }

    public function area()
    {
        return $this->belongsTo(\App\Models\World\Area::class);
    }

    public function city()
    {
        return $this->area()->first()->city();
    }

    public function getShippingAddressAttribute($query)
    {
        return $query->where('type', 'shipping')->whereIsActive(1);
    }

    public function scopeBilling($query)
    {
        return $query->where('type', 'billing')->whereIsActive(1);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeIsActive()
    {
        $this->whereIsActive(1);
    }

    public function orders()
    {
        return $this->hasMany(\App\Models\Sales\Order\Order::class);
    }
}
