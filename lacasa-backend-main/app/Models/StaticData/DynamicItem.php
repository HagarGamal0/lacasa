<?php

namespace App\Models\StaticData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use function App\Http\Helpers\getLanguages;

class DynamicItem extends Model implements Sortable  , TranslatableContract
{
    use HasFactory, SortableTrait;
    use Translatable;
    public $sortable = [
        'order_column_name' => 'order',
        'sort_when_creating' => true,
    ];
    protected $guarded = [];
    protected $table = 'static_items';

    public $translatedAttributes = ['title', 'subtitle','description'];

    public function section()
    {
        return $this->belongsTo(DynamicSection::class);
    }

    public function image()
    {
        return $this->morphOne(\App\Models\Catalog\Product\Image::class, 'imageable');
    }


    public function getImageAttribute()
    {
        $images =  $this->getImageTranslateAttribute();
        return $images[request()->header('X-localization')] ?? $images['en'];
    }
    public function getMobileImageAttribute()
    {
        $images =  $this->getMobileImageTranslateAttribute();
        return $images[request()->header('X-localization')] ?? $images['en'];
    }

    public function getImageTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
            $data[$lang['locale']] = $this->morphOne(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('Dynamic Image')->where('locale',$lang['locale'])->first();
        }
        return $data;
    }

    public function getMobileImageTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
            $data[$lang['locale']] = $this->morphOne(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('Mobile Dynamic Image')->where('locale',$lang['locale'])->first();
        }
        return $data;
    }

    
    public function getTitleTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->title : null;
        }
         return $data;
    }

    public function getSubtitleTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->subtitle : null;
        }
         return $data;
    }

    public function getDescriptionTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->description : null;
        }
         return $data;
    }
}
