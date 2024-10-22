<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerTranslation extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['company_name', 'job_title','bio','address'];


}
