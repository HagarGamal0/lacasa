<?php

namespace App\Models\Sales\Order;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function order_product()
    {
        return $this->belongsTo(OrderProduct::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // End of Relationships
}
