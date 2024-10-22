<?php

namespace App\Models\Catalog\Product\dom;

use App\Models\User\User;
use App\Models\User\Vendor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Cviebrock\EloquentSluggable\Sluggable;

use function App\Http\Helpers\getLanguages;
use DB;
class Product extends Model implements TranslatableContract
{
    use HasFactory, LogsActivity,Translatable,Sluggable; //
    protected $guarded = []; // Mark all attributes as fillable

    public $translatedAttributes = ['name', 'description','short_description'];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($product) {
            // $product->price_after_sale = $product->price_after_sale;
        });
        self::updating(function ($product) {
            $product->price_after_sale = $product->price_after_sale;
        });
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

    public function setSlugAttribute($value)
    {
        $this->attributes['slug'] = $value;
    }


    /**
     *   Relationships
     */
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function traffic()
    {
        return $this->morphMany(Traffic::class, 'trafficable');
    }

    public function shipping_profile()
    {
        return $this->belongsTo(\App\Models\Sales\Shipping\ShippingProfile::class);
    }

    public function categories()
    {
        return $this->belongsToMany(\App\Models\Catalog\Category::class, 'products_categories');
    }

    public function vendor()
    {
        return $this->belongsTo(\App\Models\User\User::class);
    }


    public function attribute_values()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attribute_value')->using(ProductAttributeValue::class)->withPivot(['price', 'price_after_sale']);
    }

    public function flash_sale()
    {
        return $this->belongsTo(\App\Models\Sales\Offer\FlashSale::class);
    }

    public function orders()
    {
        return $this->belongsToMany(\App\Models\Sales\Order\Order::class, 'orders_products')->withPivot(['quantity', 'price', 'shipping_fees', 'subtotal', 'status', 'attributes', 'commission', 'vendor_revenue', 'purchase_price', 'coupon_discount', 'shipping_notes']);
    }

    public function coupon()
    {
        return $this->belongsToMany(\App\Models\Sales\Offer\Coupon::class, 'coupon_product');
    }

    public function tags()
    {
        return $this->morphToMany(\App\Models\Catalog\Tag::class, 'taggable');
    }

    public function flash_reprice()
    {
        return $this->hasOne(\App\Models\Sales\Offer\FlashReprice::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function approved_reviews()
    {
        return $this->hasMany(Review::class)->whereStatus('Approved');
    }

    // End of Init Product Attributes on boot

    /**
     * Custom attributes
     */
    public function getPriceAfterSaleAttribute()
    {
        if ($this->discount > 0) {
            if ($this->discount_type == 'fixed') {
                $price_after_sale = intval($this->price) - intval($this->discount);
            } else {
                $price_after_sale = intval($this->price) - (intval($this->price) * intval($this->discount) / 100);
            }
        } else {
            $price_after_sale = $this->price;
        }
        // replace price if flash_reprice exists and valid
        if ($this->flash_reprice && $this->flash_reprice?->expire_at > Carbon::now() && $this->flash_reprice?->start_date < Carbon::now()) {
            return  $this->flash_reprice->flash_price;
        }
        //TODO: find a way to replace with flash sale price;
        // if($this->flash_sale()->count() > 0){
        if ($this->flash_sale && $this->flash_sale?->expire_at > Carbon::now()) {
            $flash_sale_discount = $this->flash_sale->where('expire_at', '>', Carbon::now())->first()->precentage_discount;

            return $price_after_sale - $price_after_sale * $flash_sale_discount / 100;
        }

        return $price_after_sale;
    }


    public function getSaveAttribute()
    {
        return $this->price - $this->price_after_sale;
    }

    public function GetIsFreeAttribute()
    {

        return \App\Models\ShippingFee::whereVendorId($this->vendor_id)->whereIn('category_id', $this->categories()->pluck('id'))->whereIsFree(1)->first() ? true : false;
    }

    public function getVisitsAttribute()
    {
        return $this->traffic->count();
    }

    public function getHitsAttribute()
    {
        return $this->traffic->sum('visits');
    }
    // End of Custom Attributes

    // Scopes and Filters
    public function scopePriceBetween(Builder $query, $price1, $price2): Builder
    {
        return $query->where('price_after_sale', '>=', $price1)->where('price_after_sale', '<=', $price2);
    }

    public function scopeIsSale(Builder $query, $value): Builder
    {
 
        return $value ? $query->where('discount', '>', 0)->whereRaw('price != price_after_sale') : $query;
    }

    public function scopeIsFreeShipping(Builder $query, $value): Builder
    {
        return $value ?
        $query->whereHas('shipping_profile.shipping_rules', function (Builder $query) {
            $query->whereShippingFee(0)->whereIsDisabled(0);
        })
        : $query;
    }


    public function scopeCategory(Builder $query, $categories):Builder
    {
        $categoryArray = explode('*', $categories);
        return $query->whereHas('categories', function (Builder $query) use ($categoryArray) {
            $query->whereIn('slug',$categoryArray);
        });
    }


    public function scopeVendors(Builder $query, $vendors):Builder
    {
        $vendorArray = explode('*', $vendors);
        return $query->whereHas('vendor', function (Builder $query) use ($vendorArray) {
            $query->whereHas('vendor', function (Builder $query) use ($vendorArray) {
                $query->whereIn('company_name',$vendorArray);
            });
        });
    }

    public function scopeSpecialProducts(Builder $query, $Products):Builder
    {
        $productArray = explode('*', $Products); 

        return $query->orWhereIn('products.id',$productArray);
    }
    
    public function scopeCustomProducts(Builder $query, $custom_products):Builder
    {
        $productArray = explode('*', $custom_products); 
        
        return $query->WhereIn('products.id',$productArray);
    }

    public function scopeSlug(Builder $query,$value):Builder
    {
        return $query->when(!is_numeric($value), function ($query) use ($value) {
                return $query->when(preg_match('/^[0-9]+$/', substr(strrchr($value, '-'), -1)), function ($query) use ($value) {
                    return $query->where('slug', '=', $value);
                }, function ($query) use ($value) {
                    return $query->where('slug', '=', $value)->orwhereRaw("REPLACE(slug, SUBSTRING_INDEX(slug, '-', -1), '') = '$value-'");
                });
        }, function ($query) use ($value) {
            return $query->where('id', '=', $value);
        });
  
         
    
      
    }

    








    public function scopeSearchFilter(Builder $query, $value): Builder
    {
        return $query->select('products.*')
            ->whereTranslationLike('name', '%' . $value . '%')
            ->orWhere('sku', 'LIKE', '%' . $value . '%')
            ->orWhere('slug', 'LIKE', '%' . $value . '%');
     
    }

    public function scopeName(Builder $query, $value): Builder
    {
        return $query->select('products.*')
            ->whereTranslationLike('name', '%' . $value . '%');
    }

    // End of Scopes and filters

    // Intialize logs
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logAll()
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs();
   
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
    public function getShortDescriptionTranslateAttribute()
    {
        $langs =  getLanguages();
        foreach($langs as $k =>$lang){
          $data[$lang['locale']] = $this->hasTranslation($lang['locale']) ? $this->translate($lang['locale'])->short_description : null;
        }
         return $data;
    }


   
}
