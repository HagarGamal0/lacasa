<?php

namespace App\Models\StaticData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicItemTranslation extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['title', 'subtitle','description'];
    protected $table = 'static_item_translations';
    
}
