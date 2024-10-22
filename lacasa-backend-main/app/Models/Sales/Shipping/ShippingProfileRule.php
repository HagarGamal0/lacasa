<?php

namespace App\Models\Sales\Shipping;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingProfileRule extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable
    // Set custom attributes casts
    protected $casts = [
        'is_disabled' => 'boolean',
    ];
    // End of custom attributes casts

    // Relationships
    public function shipping_profile()
    {
        return $this->belongsTo(ShippingProfile::class);
    }

    public function city()
    {
        return $this->belongsTo(\App\Models\World\City::class);
    }
    // End of Relationships
}
