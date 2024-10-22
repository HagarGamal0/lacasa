<?php

namespace App\Models\User;

use App\Models\Catalog\Product\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerProject extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function designer()
    {
        return $this->belongsTo(Designer::class);
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
