<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Vendor extends Model
{
    use HasFactory,LogsActivity;
    protected $guarded = [];

    public function images()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable');
    }

    public function city()
    {
        return $this->belongsTo(\App\Models\World\City::class);
    }

    public function area()
    {
        return $this->belongsTo(\App\Models\World\Area::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function account_manager()
    {
        return $this->belongsTo(User::class, 'account_manager_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logAll()
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs();
        // Chain fluent methods for configuration options
    }

    public function seller_identity()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('Seller Identity');
    }

    public function commerical_registeration()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('Commerical Registeration');
    }

    public function tax_id()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('Tax Indentity');
    }

    public function vat()
    {
        return $this->morphMany(\App\Models\Catalog\Product\Image::class, 'imageable')->whereDescription('VAT');
    }
}
