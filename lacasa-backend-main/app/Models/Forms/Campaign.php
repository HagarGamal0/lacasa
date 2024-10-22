<?php

namespace App\Models\Forms;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;
    protected $table = 'campains'; // Fix for incorrect migration name
    protected $guarded = []; // Mark all attributes as fillable
}
