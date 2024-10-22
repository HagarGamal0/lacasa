<?php

namespace App\Models\User\Designer;

use App\Models\User\Designer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use function App\Http\Helpers\getLanguages;
use Illuminate\Database\Eloquent\SoftDeletes;

class DesignerCategory extends Model implements TranslatableContract
{
    use SoftDeletes;
    use HasFactory;
    use Translatable;

    protected $guarded = [];

    public $translatedAttributes = ['name', 'description','image'];

    protected $fillable = ['name','parent_id','description','image','type'];

    public function designer()
    {
        return $this->belongsToMany(Designer::class, 'designer_designer_category');
    }


    public function parent()
    {
        return $this->belongsTo(DesignerCategory::class, 'parent_id');
    }
    public function childs()
    {
        return $this->hasMany(DesignerCategory::class, 'parent_id');
    }


    public function getNameTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->name : null;
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

    public function getImageTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->image : null;
        }
         return $data;
    }


}
