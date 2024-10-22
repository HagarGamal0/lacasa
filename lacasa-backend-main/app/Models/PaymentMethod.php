<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;
    protected $guarded = [];

    const OrderLIMITD  = 2000;
    const PAYMENTLIMITDICOUNT  = 500;
    const PAYMENTDiscountPrecent  = 0.10;
    const CategoryExpection  = ['Appliances']; //['Electronics','APPLIANCES','Personal Care'];
    const InstallmentCategoryExpection  = ['Appliances']; //['Electronics','APPLIANCES','Personal Care'];
    const ShippingPayment  = [1,2,3];
    const globalPayment  = [1,2];
    const DebitCard  = 2;
    const VALU  = 3;
    const CashOnDelivery  = 1;
}
