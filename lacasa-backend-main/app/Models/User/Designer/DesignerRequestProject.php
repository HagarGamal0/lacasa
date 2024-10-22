<?php

namespace App\Models\User\Designer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerRequestProject extends Model
{
    use HasFactory;
    protected $fillable=['project_id','designer_request_id'];
}
