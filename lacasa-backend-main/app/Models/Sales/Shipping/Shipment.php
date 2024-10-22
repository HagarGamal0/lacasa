<?php

namespace App\Models\Sales\Shipping;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function shipping_provider()
    {
        return $this->belongsTo(ShippingProvider::class);
    }

    public function order()
    {
        return $this->belongsTo(\App\Models\Sales\Order\Order::class);
    }

    public function items()
    {
        return $this->hasMany(\App\Models\Sales\Cart\CartItem::class);
    }

    // public function vendor()
    // {
    //   return $this->belongsTo(\App\Models\User\User::class);
    // }
    // End of Relationships
}
