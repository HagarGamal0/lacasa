<?php

namespace App\Models\Sales\Offer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrangeVoucher extends Model
{
    use HasFactory;
    protected $guarded = []; // Mark all attributes as fillable

    // Relationships
    public function user()
    {
        return $this->belongsTo(\App\Models\User\User::class);
    }
    // End of Relationships
}
