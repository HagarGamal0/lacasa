<?php

namespace App\Models\Catalog\Product;

use Carbon\Carbon;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductAttributeValue extends Pivot
{
    use HasFactory;

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    // End Relationships

    // Set custom attributes
    public function getPriceAfterSaleAttribute()
    {
        if ($this->product->flash_sale && $this->product->flash_sale?->expire_at > Carbon::now()) {
            $flash_sale_discount = $this->product->flash_sale->where('expire_at', '>', Carbon::now())->first()->precentage_discount;

            return $this->attributes['price_after_sale'] - $this->attributes['price_after_sale'] * $flash_sale_discount / 100;
        }

        return $this->attributes['price_after_sale'];
    }
    // End of Custom Attributes
}
