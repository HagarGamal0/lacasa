<?php

namespace App\Models\Sales\Order;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OldTempOrderProduct extends Model
{
    use HasFactory,LogsActivity;
    public $timestamps = false; // Disable timestamps
    protected $table = 'old_temp_orders_products'; // Modify table name

    // Relationships
    public function product()
    {
        return $this->belongsTo(\App\Models\Catalog\Product\Product::class);
    }

    public function order()
    {
        return $this->belongsTo(OldTempOrder::class, 'temp_order_id');
    }
    // End of relationships

    // Scopes and Filters
    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        return $query->whereHas('Order', function ($query) use ($date) {
            $query->whereDate('created_at', '<=', Carbon::parse($date));
        });
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return $query->whereHas('Order', function ($query) use ($date) {
            $query->whereDate('created_at', '>=', Carbon::parse($date));
        });
    }
    // End of scopes and filters

   // init logs
   public function getActivitylogOptions(): LogOptions
   {
       return LogOptions::defaults()
       ->logAll()
       ->logOnlyDirty()
       ->dontSubmitEmptyLogs();
       // ->logOnly(['name', 'text']);
       // Chain fluent methods for configuration options
   }
   // end of init logs
}
