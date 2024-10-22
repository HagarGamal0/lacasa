<?php

namespace App\Models\User;

use App\Models\User\Designer\DesignerCategory as Category;
use App\Models\World\Area;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use function App\Http\Helpers\getLanguages;
class Designer extends Model implements TranslatableContract
{
    use HasFactory;
    use Translatable;
    protected $guarded = [];

    public $translatedAttributes = ['company_name', 'job_title','bio','address'];
    public function projects()
    {
        return $this->hasMany(DesignerProject::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'designer_designer_category');
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function city()
    {
        return $this->area()->city();
    }

    public function images()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getCompanyNameTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->company_name : null;
        }
         return $data;
    }
    public function getJobTitleTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->job_title : null;
        }
         return $data;
    }

    public function getBioTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->bio : null;
        }
         return $data;
    }
    public function getAddressTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->address : null;
        }
         return $data;
    }
}
