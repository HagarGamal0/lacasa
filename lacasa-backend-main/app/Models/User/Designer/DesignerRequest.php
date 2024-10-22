<?php

namespace App\Models\User\Designer;

use App\Enums\RequestImagetypeEnum;
use App\Models\User\Designer;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerRequest extends Model
{
    use HasFactory;

    protected $fillable=['id', 'user_id', 'designer_id', 'project_sector', 'project_location', 'project_area', 'project_descreption', 'desired_service', 'style_descreption', 'name', 'email', 'phone', 'phone_communication', 'email_communication', 'whatsapp_communication', 'f_10_to_5_am', 'f_5_to_10_am', 'f_10_to_5_pm', 'f_5_to_10_pm','status'];
    public function projectsScope()
    {
        return $this->hasMany(DesignerRequestProject::class);
    }

    public function images()
    {
        return $this->hasMany(DesignerRequestImage::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function designer()
    {
        return $this->belongsTo(Designer::class);
    }

    public function drawings()
    {
        return $this->hasMany(DesignerRequestImage::class)->where('type',RequestImagetypeEnum::Drawing);
    }
    public function inspirations()
    {
        return $this->hasMany(DesignerRequestImage::class)->where('type',RequestImagetypeEnum::Inspiration);
    }
}
