<?php

namespace App\Models\Sales\Order;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OldOrderProduct extends Model
{
    use HasFactory,LogsActivity;
    public $timestamps = false; // Disable Timestamp
    protected $table = 'old_orders_products'; // Change table name
    protected $casts = [
        'attibutes' => 'array',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(\App\Models\Catalog\Product\Product::class);
    }

    public function order()
    {
        return $this->belongsTo(OldOrder::class, 'order_id');
    }

    public function status_history()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

     public function shipment()
     {
         return $this->belongsTo(\App\Models\Sales\Shipping\Shipment::class);
     }
     // End of Relationships

    // Scopes and filters
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

   public function getActivitylogOptions(): LogOptions
   {
       return LogOptions::defaults()
       ->logAll()
       ->logOnlyDirty()
       ->dontSubmitEmptyLogs();
       // ->logOnly(['name', 'text']);
       // Chain fluent methods for configuration options
   }
}
