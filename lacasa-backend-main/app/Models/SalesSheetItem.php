<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SalesSheetItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_sheet_id',
        'order_id',
        'vendor_name',
        'net',
        'commission'
    ];

    public function sheet_entry() {
        return $this->belongsTo(SalesSheet::class, 'sales_sheet_id');
    }

    public function scopeCreatedBefore(Builder $query, $date): Builder
    {
        return $query->whereHas('sheet_entry', function($query) use($date){
            return $query->whereDate('order_date', '<=', Carbon::parse($date));
        });
    }

    public function scopeCreatedAfter(Builder $query, $date): Builder
    {
        return $query->whereHas('sheet_entry', function ($query) use ($date) {
            return $query->whereDate('order_date', '>=', Carbon::parse($date));
        });
    }
}
