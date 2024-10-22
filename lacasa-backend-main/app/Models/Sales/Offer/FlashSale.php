<?php

namespace App\Models\Sales\Offer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashSale extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Set custom attribute types
    protected $casts = [
        'has_shipping_profile' => 'boolean',
    ];
    // End of Casting attribute types

    // Relationships
    public function products()
    {
        return $this->hasMany(\App\Models\Catalog\Product\Product::class);
    }

    public function shipping_profile()
    {
        return $this->belongsTo(\App\Models\Sales\Shipping\ShippingProfile::class);
    }
    // End of Relationships
}
