<?php

namespace App\Models\Catalog\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['name', 'description','banner' , 'product_id', 'locale', 'short_description', 'meta_title', 'meta_description', 'meta_keywords'];



}
