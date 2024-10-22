<?php

namespace App\Models\Sales\Cart;

use App\Models\Sales\Order\DraftOrder;
use App\Models\Sales\Order\Order;
use App\Models\World\City;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'subtotal' => 'float',
        'total' => 'float',
        'shipping_fees' => 'float',
    ];

    public function order()
    {
        return $this->hasOne(Order::class);
    }
    public function draftOrder()
    {
        return $this->hasOne(DraftOrder::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function orderable()
    {
        return $this->morphTo();
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // public function getSubtotalAttribute()
    // {
    //     return $this->items->sum('subtotal');
    // }

    // public function setSubtotalAttribute()
    // {
    //     return $this->attributes['subtotal'] = $this->items->sum('subtotal');
    // }

 

    public function getPaymentAttribute()
    {
          return ($this->total - $this->total_discounts);
    }

    // public function setTotalAttribute()
    // {
    //     return $this->attributes['total'] = $this->total - $this->total_discounts;
    // }

    // public function getShippingFeesAttribute()
    // {
    //     if ($this->city_id) {
    //         return $this->items->sum('shipping_fees');
    //     }

    //     return false;
    // }

    // public function setShippingFeesAttribute()
    // {
    //     if ($this->city_id) {
    //         return $this->attributes['shipping_fees'] = $this->items->sum('shipping_fees');
    //     }
    //     return false;
    // }

    public function getDiscountsAttribute()
    {
        $discountPaymentItems =   $this->items->sum('discounts.payment_discount.value');
        $payment_method_id    =   $this->order ? $this->order->payment_method_id : 1;

        if(!isset($this->order))
        {
            $payment_method_id = $this->draftOrder ? $this->draftOrder->payment_method_id : 1;
        }

        $discountPayment      =   $payment_method_id == 2 ? (($this->subtotal * 5)/100) : 0;
        $finalPaymentDiscount =   (($discountPayment > $discountPaymentItems)) ? $discountPaymentItems : $discountPayment;

        $payment_discount     =   $finalPaymentDiscount > 300 ? 300 : $finalPaymentDiscount;

        $shipping_discount    =   $this->items->sum('discounts.shipping_discount.value') ;
        $coupons_discount     =   $this->items->sum('discounts.coupons.value');
        $orange_discount      =   $this->items->sum('discounts.orange_discount.value');
        $payment_discount     =   $coupons_discount > 0 ? 0 : $payment_discount;
        return [
            'coupons' => [
                'title' => isset($this->items->first()->discounts['coupons']['title']) ? $this->items->first()->discounts['coupons']['title'] : null,
                'value' => $coupons_discount,
            ],
            'orange_discount' => [
                'title' => 'Orange Voucher',
                'value' => $orange_discount,
            ],
            'payment_discount' => [
                'title' => 'Payment Method Discount',
                'value' => $payment_discount,
            ],
            'shipping_discount' => [
                'title' => 'Shipping discount',
                'value' => $shipping_discount,
            ]
          
        ];
    }

    public function getTotalDiscountsAttribute()
    {
        $discountValue = 0;
        foreach ($this->discounts as $discount) {
            $discountValue += $discount['value'];
        }
        return $discountValue;
    }
    // public static function boot()
    // {
    //     parent::boot();
    //     self::updating(function($model){
    //       foreach($model->items as $item){
    //         $item->update(['shipping_fees' => 5000]);
    //       }
    //       $model->update(['shipping_fees' => 5000]);
    //     });
    // }

    public function scopeValid(Builder $query): void
    {
        $query->whereIn('status', ['Cart', 'DraftOrder']);
    }
}
