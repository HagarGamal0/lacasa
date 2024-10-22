<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Addressbook\Create;
use App\Http\Requests\User\Addressbook\Update;
use App\Http\Resources\User\Addressbook as AddressbookResource;
use App\Models\User\User;

class UserAddressBookController extends Controller
{
    /**
     * Instantiate a new UserController instance.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

     public function index($user_id)
     {
         return AddressbookResource::collection(User::find($user_id)->addressbooks()->whereIsActive(1)->get());
     }

     public function store(Create $request, $user_id)
     {
         $address = $request->validated();
         $address['default'] == 1 ? User::find($user_id)->addressbooks()->where('type', $address['type'])->update(['default' => 0]) : '';

         return new AddressbookResource(User::find($user_id)->addressbooks()->create($address));
     }

     public function update(Update $request, $user_id, $id)
     {
         // return $id;
         $address = $request->validated();
         $address['default'] == 1 ? User::find($user_id)->addressbooks()->whereType($address['type'])?->update(['default' => 0]) : '';
         User::findorfail($user_id)->addressbooks()->findorfail($id)->update($address);

         return new AddressbookResource(User::find($user_id)->addressbooks()->find($id));
     }

     public function show($user_id, $id)
     {
         return new AddressbookResource(User::find($user_id)->addressbooks()->find($id));
     }

     public function destroy($user_id, $id)
     {
         User::find($user_id)->addressbooks()->findorfail($id)->update(['is_active' => 0]);

         return [
             'code' => 200,
             'status' => 'success',
             'data' => [],
         ];
     }
}
