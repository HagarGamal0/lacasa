<?php

namespace App\Http\Controllers\Api\Forms;

use App\Http\Controllers\Controller;
use App\Http\Requests\contactUs\CreateCompainRequest;
use App\Mail\Admin\Campaign\Recieved as RecievedCampaignMail;
use App\Models\Forms\Campaign;
use Illuminate\Http\Request;
use Mail;

class CampaignController extends Controller
{
    public function index()
    {
        return ['data' => Campaign::all()];
    }

    public function store(CreateCompainRequest $request)
    {
        $validated = $request->validated();

        $contact = Campaign::create($validated);
        Mail::to(['belal@lacasa-egy.com'])->send(new RecievedCampaignMail($contact));

        return $contact;
    }
}
