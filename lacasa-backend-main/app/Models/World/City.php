<?php

namespace App\Models\World;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function App\Http\Helpers\getLanguages;
use Illuminate\Support\Facades\App;
class City extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function routes()
    {
        return $this->hasMany(Route::class);
    }

    public function areas()
    {
        return $this->hasMany(Area::class);
    }

    public function setNameAttribute()
    {
         return App::isLocale('ar') ? $this->ar_name : $this->name;
    }
    public function getNameTranslateAttribute()
    {
         $data['ar'] = $this->ar_name  ;
         $data['en'] = $this->name ;

         return  $data;
    }
}
