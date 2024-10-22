<?php

namespace App\Http\Services\Orders;

use App\Models\User\AddressBook;
use App\Models\User\User;
use Auth;
use Str;

class ValidateUser
{
    public function address($order)
    {
        if (isset($order['address_id'])) { //if address provided retrive address
            $address = AddressBook::find($order['address_id']);
            $user = $address->user;
        } elseif (isset($order['address_book_id'])) {
            $address = AddressBook::find($order['address_book_id']);
            $user = $address->user;
        } else { // if address doesnt exist create new address
            //check if a user was registered already using the address email
            $user_email = $order['address']['email'];
            if (Auth::guard('sanctum')->user()) {
                $user = Auth::guard('sanctum')->user();
            } else {
                $user = User::whereEmail($user_email)->first();
                //if user doesnt exist create a new user
                if (! $user) {
                    $user = $this->createUser($order);
                }
            }
            // assign the address to the user
            $address = collect($order['address'])->except('address')->put('user_id', $user->id)->toArray();
            $address = AddressBook::updateOrcreate($address);
        }

        return $address;
    }

    public function createUser($order)
    {
        return $user = User::create([
            'name' => $order['address']['first_name'] . ' ' . $order['address']['last_name'],
            'email' => $order['address']['email'],
            'phone' => $order['address']['phone'],
            'password' => Str::random(24),
        ]);
    }
}
