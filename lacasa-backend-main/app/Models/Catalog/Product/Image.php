<?php

namespace App\Models\Catalog\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable
    public $fillable = ['id', 'locale','url','description','imageable_id','imageable_type'];
    public $hidden = ['locale','description','imageable_id','imageable_type','created_at','updated_at'];
    // Relationships
    public function imageable()
    {
        return $this->morphTo();
    }
    // End Relationships
}
