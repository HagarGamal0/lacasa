<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Addressbook\Create;
use App\Http\Requests\User\Addressbook\Update;
use App\Http\Resources\User\Addressbook as AddressbookResource;
use Auth;

class ProfileAddressBookController extends Controller
{
    /**
     * Instantiate a new UserController instance.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

     public function index()
     {
         return Auth::user()->addressbooks()->whereIsActive(1)->get();
     }

     public function store(Create $request)
     {
         $address = $request->validated();
         $address['default'] == 1 ? Auth::user()->addressbooks()->where('type', $address['type'])->update(['default' => 0]) : '';

         return new AddressbookResource(Auth::user()->addressbooks()->create($address));
     }

     public function update(Update $request, $id)
     {
         $address = $request->validated();
         $address['default'] == 1 ? Auth::user()->addressbooks()->where('type', $address['type'])->update(['default' => 0]) : '';
         $address['default'] == 0 ? Auth::user()->addressbooks()->is_active()->where('type', $address['type'])->first()->update(['default' => 1]) : '';
         Auth::user()->addressbooks()->findorfail($id)->update($address);

         return new AddressbookResource(Auth::user()->addressbooks()->find($id));
     }

     public function show($id)
     {
         return new AddressbookResource(Auth::user()->addressbooks()->find($id));
     }

     public function destroy($id)
     {
         $address = Auth::user()->addressbooks()->findorfail($id);
         Auth::user()->addressbooks()->whereIsActive(1)->first()->update(['default' => 1]);
         Auth::user()->addressbooks()->findorfail($id)->update(['is_active' => 0]);

         return [
             'code' => 200,
             'status' => __('lang.success'),
             'data' => [],
         ];
     }
}
