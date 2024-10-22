<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Regular\Update as UpdateRegular;
use App\Http\Requests\User\UpdateProfile;
use App\Http\Resources\Roles\Permission as PermissionResource;
use App\Http\Resources\User\DesignerUser;
use App\Http\Resources\User\RegularUser;
use App\Http\Resources\User\VendorUser;
use App\Models\User\User;
use App\Models\User\Vendor;
use Auth;
use Storage;
use Str;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['only' => ['profile', 'updateProfile', 'getPermissions']]);
    }

    public function profile()
    {
        return User::find(Auth::id())->is_vendor() ? new VendorUser(User::find(Auth::id())) : new RegularUser(User::find(Auth::id()));
    }

    public function updateProfile(UpdateProfile $request)
    {
        $user_data = collect($request->validated())->only(collect((new UpdateRegular)->rules())->keys())->toArray();
        $user = User::find(Auth::id())->update($user_data);
        if (User::find(Auth::id())->is_vendor()) {
            $vendor_data = collect($request->validated())->except(collect((new UpdateRegular)->rules())->keys())->toArray()['vendor'];
            $vendor_data['logo'] = ! $request->file('logo') ? User::find(Auth::id())->vendor->logo : Storage::url($request->file('logo')->store('public/users/' . Auth::id() . '/logo'));
            User::find(Auth::id())->vendor()->update(collect($vendor_data)->except(['seller_identity', 'commerical_registeration', 'tax_id', 'vat'])->toArray());
            if ($request->has('vendor.seller_identity')) {
                foreach ($request->file('vendor.seller_identity') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    Vendor::find(Auth::user()->vendor->id)->images()->create(['url' => Storage::url('public/vendors/' . Auth::id() . '/' . $fileName), 'description' => 'Seller Identity']);
                }
            }
            if ($request->has('vendor.commerical_registeration')) {
                foreach ($request->file('vendor.commerical_registeration') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    Vendor::find(Auth::user()->vendor->id)->images()->create(['url' => Storage::url('public/vendors/' . Auth::id() . '/' . $fileName), 'description' => 'Commerical Registeration']);
                }
            }

            if ($request->has('vendor.tax_id')) {
                foreach ($request->file('vendor.tax_id') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    Vendor::find(Auth::user()->vendor->id)->images()->create(['url' => Storage::url('public/vendors/' . Auth::id() . '/' . $fileName), 'description' => 'Tax Indentity']);
                }
            }
            if ($request->has('vendor.vat')) {
                foreach ($request->file('vendor.vat') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    Vendor::find(Auth::user()->vendor->id)->images()->create(['url' => Storage::url('public/vendors/' . Auth::id() . '/' . $fileName), 'description' => 'VAT']);
                }
            }

            return new VendorUser(User::find(Auth::id()));
        } elseif (User::find(Auth::id())->is_designer()) {
            $designer_data = collect($request->validated())->except(collect((new UpdateRegular)->rules())->keys())->toArray();
            // $designer_data['avatar'] = !$request->file('avatar') ? User::find(Auth::id())->designer->avatar : Storage::url($request->file('avatar')->store('public/users/'.$id.'/avatar'));
            if ($request->has('avatar')) {
                $image = $request->file('avatar');
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
                $designer_data['avatar'] = Storage::url('public/users/' . $fileName);
            }
            if ($request->has('cover_photo')) {
                $image = $request->file('cover_photo');
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
                $designer_data['cover_photo'] = Storage::url('public/users/' . $fileName);
            }

            if ($request->has('designer_identity')) {
                foreach ($request->file('designer_identity') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/designers/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    User::find(Auth::id())->designer()->first()->images()->create(['url' => Storage::url('public/designers/' . Auth::id() . '/' . $fileName), 'description' => 'Designer Identity']);
                }
            }
            if ($request->has('commerical_registeration')) {
                foreach ($request->file('commerical_registeration') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/designers/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    User::find(Auth::id())->designer()->first()->images()->create(['url' => Storage::url('public/designers/' . Auth::id() . '/' . $fileName), 'description' => 'Commerical Registeration']);
                }
            }

            if ($request->has('tax_id')) {
                foreach ($request->file('tax_id') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/designers/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    User::find(Auth::id())->designer()->first()->images()->create(['url' => Storage::url('public/designers/' . Auth::id() . '/' . $fileName), 'description' => 'Tax Indentity']);
                }
            }
            User::find(Auth::id())->designer()->update(collect($designer_data)->except(['categories', 'designer_identity', 'commerical_registeration', 'tax_id'])->toArray());
            User::find(Auth::id())->designer()->first()->categories()->syncWithoutDetaching($designer_data['categories']);

            return new DesignerUser(User::find(Auth::id()));
        } else {
            return new RegularUser(User::find(Auth::id()));
        }
    }

    public function getPermissions()
    {
        // return PermissionResource::collection(User::find(Auth::id())->getPermissionsViaRoles());
        return User::find(Auth::id())->getPermissionsViaRoles();
    }
    // public function updateProfile(UpdateRegular $request)
    // {
    //   $user_data = collect($request->validated())->only(collect((new UpdateRegular)->rules())->keys())->toArray
    //   $user = User::find(Auth::id())->update($user_data);
    //   return new RegularUser(User::find(Auth::id()));
    // }
}
