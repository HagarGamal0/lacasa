<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use function App\Http\Helpers\getLanguages;

class Category extends Model implements Sortable ,TranslatableContract
{
    use Translatable;
    use HasFactory;
    use SortableTrait;

    public $translatedAttributes = ['name', 'description','banner'];

    public $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    protected $guarded = [];

    protected $casts = [
        'show_in_menu' => 'boolean'
    ];

    public function products()
    {
        return $this->belongsToMany(\App\Models\Catalog\Product\Product::class, 'products_categories');
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function childs()
    {
        return $this->hasMany(self::class, 'parent_id')->with('childs');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

   /**
    * Get the main category (root) of the current category.
    */
   public function getParentCategories(): array
   {
       $mainCategory = [$this->id];

       if ($this->parent_id) {
           $mainCategory = array_merge($mainCategory, $this->parent->getParentCategories());
       }

       return $mainCategory;
   }
    // End of Relationships

    public function getNameTranslateAttribute():array
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->name : null;
        }
         return $data;
    }

    public function getBannerTranslateAttribute():array
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->banner : null;
        }
         return $data;
    }

    public function getProductsDetailAttribute()
    {
            $data['sumProductsPrice'] = $this->products()->sum('price_after_sale');
            $data['productsCount']    = $this->products()->count();
            $data['average']          = $data['productsCount'] != 0 ? round(($data['sumProductsPrice']/$data['productsCount']),2):0;
            return  $data ;
    }
}
