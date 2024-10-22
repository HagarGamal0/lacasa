<?php

namespace App\Models\User\Designer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerCategoryTranslation extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['name', 'description','image'];


}
