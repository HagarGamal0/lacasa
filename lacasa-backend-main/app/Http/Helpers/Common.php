<?php

namespace App\Http\Helpers;
use App\Models\Language;
use Illuminate\Support\Facades\Cache;

if (!function_exists('get_languages')) {
    function getLanguages()
    {
        if (Cache::has('allLanguages')) {
            $allLanguages = Cache::get('allLanguages');
        } else {
            $allLanguages = Language::all();
            Cache::put('allLanguages', $allLanguages);
        }

        return $allLanguages;
    }
}

if (!function_exists('generateRandomString')) {
    function generateRandomString($length = 10)
    {
        // $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $characters = '0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
