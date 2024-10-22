<?php

namespace App\Http\Controllers\Api\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\contactUs\CreateContantUsRequest;
use App\Mail\Admin\ContactUs\Recieved as RecievedContactUsMail;
use App\Models\Forms\ContactUs;
use Illuminate\Http\Request;
use Mail;

class ContactUsController extends Controller
{
    public function index()
    {
        return ['data' => ContactUs::all()];
    }

    public function store(CreateContantUsRequest $request)
    {
        $validated = $request->validated();

        $contact = ContactUs::create($validated);
        Mail::to(['support@lacasa-egy.com'])->send(new RecievedContactUsMail($contact));

        return $contact;
    }
}
