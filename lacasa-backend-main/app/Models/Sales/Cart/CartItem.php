<?php

namespace App\Models\Sales\Cart;

use App\Models\Catalog\Product\Product;
use App\Models\Sales\Order\OrderStatusHistory;
use App\Models\Sales\Shipping\Shipment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class CartItem extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $guarded = false;

    protected $casts = [
        'attributes' => 'array',
        'discounts' => 'array',
        'price' => 'float',
        'total' => 'float',
        'shipping_fee' => 'float',
        'total_shipping_fees' => 'float',
    ];

    protected $hidden = [
        'attributes_decoded',
    ];

    protected $attributes = [
        'attributes' => '[]',
        'discounts' => '[]',
        'shipping_fees' => 0,
        'total_shipping_fees' => 0,
        'status' => 'Pending Confirmation',
    ];


    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    public function status_history(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function getShippingRulesAttribute()
    {
        return $this->product->shipping_profile->shipping_rules;
    }

    public function getSubtotalAttribute()
    {
        return $this->price * $this->quantity;
    }

    public function getTotalAttribute()
    {
        return ($this->subtotal  + $this->total_shipping_fees) - $this->total_discounts;
    }

    public function setTotalAttribute()
    {
        return $this->attributes['total'] = ($this->subtotal  + $this->total_shipping_fees) - $this->total_discounts;
    }


    public function getDiscountsDetailsAttribute()
    {
        foreach ($this->discounts as $k => $discount) {
            $discounts[$k]['title']= $discount['title'];
            $discounts[$k]['value']= $discount['value'];
        }
        return [
            'coupons' => [
                'title' => isset($discounts['coupons']) ? $discounts['coupons']['title'] : null,
                'value' => isset($discounts['coupons']) ?  $discounts['coupons']['value'] : 0,
            ],
            'orange_discount' => [
                'title' => isset($discounts['orange_discount']) ? $discounts['orange_discount']['title'] : null,
                'value' => isset($discounts['orange_discount']) ?  $discounts['orange_discount']['value'] : 0,
            ],
            'payment_discount' => [
                'title' => isset($discounts['payment_discount']) ? $discounts['payment_discount']['title'] : null,
                'value' => isset($discounts['payment_discount']) ?  $discounts['payment_discount']['value'] : 0,
            ],
            'shipping_discount' => [
                'title' => isset($discounts['shipping_discount']) ? $discounts['shipping_discount']['title'] : null,
                'value' => isset($discounts['shipping_discount']) ?  $discounts['shipping_discount']['value'] : 0,
            ]
        ];

    }

    public function getTotalDiscountsAttribute()
    {
        $discountValue = 0;
        foreach ($this->discounts as $discount) {
            // if($discount['title'] == "coupons" || $discount['title'] == "orange_discount" ){
                 $discountValue += $discount['value'];
            // }
        }

        return $discountValue;
    }

    public function getCommissionAttribute()
    {
        return $this->subtotal * ($this->product->vendor->vendor->commission / 100);
    }

    public function getVendorRevenueAttribute()
    {
        return $this->subtotal - $this->commission;
    }

    public function setCommissionAttribute(): void
    {
        $this->attributes['commission'] = $this->subtotal * ($this->product->vendor->vendor->commission / 100);
        $this->attributes['vendor_revenue'] = $this->subtotal - $this->commission;
    }


    public function getAvailableStatusAttribute()
    {
        if ('Ready To Ship' === $this->status) {
            return [
                'type' => 'products',
                'id' => $this->id,
                'statuses' => ['Shipped'],
            ];
        }
        if ($this->shipment_id) {
            return [
                'type' => 'shipments',
                'id' => $this->shipment_id,
                'statuses' => ['Arrived', 'Failed To Deliver', 'Shipped'],
            ];
        }

        return [
            'type' => 'products',
            'id' => $this->id,
            'statuses' => ['Pending Payment', 'Customer Confirmed', 'Processing', 'Ready To Ship', 'Rejected', 'Returned', 'Refunded'],
        ];
    }

    // Init logs
     public function getActivitylogOptions(): LogOptions
     {
         return LogOptions::defaults()
             ->logAll()
             ->logOnlyDirty()
             ->dontSubmitEmptyLogs();
         // Chain fluent methods for configuration options
     }
     // End of init logs
}
