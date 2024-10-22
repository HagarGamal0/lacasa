<?php

namespace App\Models\Sales\Offer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WheelOffer extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function coupon()
    {
        return $this->belongsTo(\App\Models\Sales\Offer\Coupon::class);
    }
    // End of Relationships
}
