<?php

namespace App\Models\Sales\Shipping;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingProfile extends Model
{
    use HasFactory;

    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function shipping_rules()
    {
        return $this->hasMany(ShippingProfileRule::class);
    }

    public function products()
    {
        return $this->hasMany(\App\Models\Catalog\Product\Product::class);
    }

    public function provider()
    {
        return $this->belongsTo(ShippingProvider::class, 'shipping_provider_id');
    }
    // End of Relationships
}
