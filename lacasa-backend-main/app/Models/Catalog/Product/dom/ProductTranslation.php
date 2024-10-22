<?php

namespace App\Models\Catalog\Product\dom;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['name', 'description','banner'];

    
  
}
