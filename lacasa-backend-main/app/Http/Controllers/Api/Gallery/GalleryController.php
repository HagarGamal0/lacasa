<?php

namespace App\Http\Controllers\Api\Gallery;
use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use Illuminate\Http\Request;
use App\Jobs\ImageUploadJob;
use App\Models\Gallery\Gallery;
use App\Traits\GeneralResponse;
class GalleryController extends Controller
{
    public function uploadImages(Request $request)
    {
        $images = $request->file('images');
        if ($images) {
            foreach ($images as $k => $image) {
                $fileName = uniqid() . '.' . $image->getClientOriginalExtension();
                \Storage::put('public/products/'.$fileName, file_get_contents($image), 'public');
                $url      = \Storage::url('public/products/' .  $fileName);
                $insert[$k]['url'] = $url;
            }
            Gallery::insert($insert);
            $message ='Image upload queued successfully.';
            return  GeneralResponse::responseMessage('success',$message);
        }
        $message ='No images found.';
        return  GeneralResponse::responseMessage('error',$message,400);
    }

    public function index(){
        return GalleryResource::collection(Gallery::orderBy('id','DESC')->get());
    }
}
