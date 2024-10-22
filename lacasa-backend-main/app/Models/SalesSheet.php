<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesSheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'order_date',
        'customer_name',
        'payment_method',
        'status'
    ];

    protected $casts = [
        'order_date' => 'date'
    ];

    public function items() {
        return $this->hasMany(SalesSheetItem::class);
    }
}
