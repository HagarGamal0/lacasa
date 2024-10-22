<?php

namespace App\Models\Sales\Offer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashReprice extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function product()
    {
        return $this->belongsTo(\App\Models\Catalog\Product\Product::class);
    }
    // End of Relationships
}
