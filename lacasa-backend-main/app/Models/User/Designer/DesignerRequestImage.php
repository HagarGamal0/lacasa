<?php

namespace App\Models\User\Designer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerRequestImage extends Model
{
    use HasFactory;
    protected $fillable=['type','url','designer_request_id'];
    protected $hidden=['designer_request_id','created_at','updated_at','type'];
}
