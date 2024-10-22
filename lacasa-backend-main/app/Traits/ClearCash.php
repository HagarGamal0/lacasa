<?php

namespace App\Traits;
use Illuminate\Http\Responce;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use function App\Http\Helpers\getLanguages;
class ClearCash
{
    public static function flush($model)
    {
        // $langs =  getLanguages();
        // foreach($langs as $k =>$lang){
        //    Cache::tags("{$model}_{$lang}")->flush();
        // }
        Artisan::call('cache:clear');
        Cache::flush();
    }


}
