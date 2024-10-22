<?php

namespace App\Models\World;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function App\Http\Helpers\getLanguages;
use Illuminate\Support\Facades\App;
class Area extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function getNameTranslateAttribute()
    {
         $data['ar'] = $this->ar_name  ;
         $data['en'] = $this->name ;

         return  $data;
    }

  
}
