<?php

namespace App\Http\Controllers\Api\Translate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;
use App\Traits\GeneralResponse;
class TranslateController extends Controller
{

    private $sourceLanguage;
    private $targetLanguage;

    public function __construct()
    {
        $this->sourceLanguage = 'en';
        $this->targetLanguage = 'ar';
    }
    public function translate(Request $request)
    {
        try{
            if($request->text != ""){
                $translator = new GoogleTranslate($this->targetLanguage,$this->sourceLanguage);
                $translation = $translator->translate($request->text);
                return GeneralResponse::responseMessage('success',$translation);
            }else{
                return GeneralResponse::responseMessage('error',"Send text please",400);
            }

        }catch (\Exception $e){
            return GeneralResponse::responseMessage('error',$e,400);
        }




    }
}
