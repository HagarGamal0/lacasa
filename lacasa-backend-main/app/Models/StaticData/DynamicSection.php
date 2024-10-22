<?php

namespace App\Models\StaticData;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicSection extends Model
{
    use HasFactory;
    protected $table = 'static_sections';
    protected $guarded = [];

    

    public function items()
    {
        return $this->hasMany(DynamicItem::class, 'section_id');
    }

    public function image()
    {
        return $this->morphOne(\App\Models\Catalog\Product\Image::class, 'imageable');
    }

    public function mobile_image()
    {
        return $this->morphOne(\App\Models\Catalog\Product\Image::class, 'imageable');
    }

    public function scopeHomeSlider()
    {
        return $this->firstOrCreate(['name' => 'home-slider'])->items()->orderBy('order');
    }

    public function scopeHomeSliderBanner()
    {
        return $this->firstOrCreate(['name' => 'home-slider-banner'])->items()->orderBy('order');
    }

    public function scopeTopAdBanner()
    {
        return $this->firstOrCreate(['name' => 'top-ad-banner'])->items()->orderBy('order');
    }

    public function scopeBottomAdBanner()
    {
        return $this->firstOrCreate(['name' => 'bottom-ad-banner'])->items()->orderBy('order');
    }

    public function scopeTopNotification()
    {
        return $this->firstOrCreate(['name' => 'top-notification'])->items()->orderBy('order');
    }

    public function scopeSection(Builder $query, $section)
    {
        return $this->firstOrCreate(['name' => $section])->items()->orderBy('order');
    }

}
