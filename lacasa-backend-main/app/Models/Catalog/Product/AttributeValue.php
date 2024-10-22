<?php

namespace App\Models\Catalog\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    public function products()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attribute_value')->withPivot(['price', 'price_after_sale']);
    }
    //End Relationships
}
