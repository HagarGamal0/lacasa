<?php

namespace App\Jobs;

use App\Models\Gallery\Gallery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ImageUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $image=null;
    protected $imageRulPath=null;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($image ,$imageRulPath)
    {
        $this->image = $image;
        $this->imageRulPath = $imageRulPath;
    }

    public function handle()
    {
        // $fileName = uniqid() . '.' . $this->image;
        // Storage::put('public/products/'.$fileName, file_get_contents($this->imageRulPath), 'public');
        // $url      = Storage::url('public/products/' .  $fileName);
        Gallery::create([
            'url' => $this->image
        ]);
    }
}
