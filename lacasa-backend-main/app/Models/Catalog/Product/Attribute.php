<?php

namespace App\Models\Catalog\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function values()
    {
        return $this->hasMany(AttributeValue::class);
    }
    // End Relationships
}
