<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Regular\Create as CreateRegular;
use App\Http\Requests\User\Regular\Update as UpdateRegular;
use App\Http\Requests\User\Vendor\Create;
use App\Http\Requests\User\Vendor\Update;
use App\Http\Resources\User\VendorUser;
use App\Mail\User\User\Created as UserCreatedUserMail;
use App\Models\User\User;
use App\Models\User\Vendor;
use Auth;
use Illuminate\Http\Request;
use Mail;
use Spatie\QueryBuilder\QueryBuilder;
use Storage;
use Str;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['only' => ['profile', 'updateProfile']]);
    }

    public function index(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        // return VendorUser::collection(User::isVendor()->paginate($pagination));
        return VendorUser::collection(QueryBuilder::for(User::isVendor())
          ->allowedFilters([
              'name',
              'id',
              'phone',
              'vendor.name',
              'vendor.status',
              'email',
          ])
          ->allowedSorts([
              'id',
              'phone',
              'email',
              'name',
          ])->paginate($pagination));
    }

    public function show($id)
    {
        return new VendorUser(User::find($id));
    }

    // public function store(Request $request)
    public function store(Create $request)
    {
        //Create User
        $user_data = collect($request->validated())->only(collect((new CreateRegular)->rules())->keys())->toArray();
        $user = User::create($user_data);
        // Prepare Vendor data
        $vendor_data = collect($request)->except(collect((new UpdateRegular)->rules())->keys())->toArray()['vendor'];
        // $vendor_data['logo'] = Storage::url($request->file('vendor.logo')->store('public/users/'.$user->id.'/logo'));
        // Upload Vendor Logo Image
        $image = $request->file('vendor.logo');
        $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
        $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
        $vendor_data['logo'] = Storage::url('public/users/' . $fileName);
        //Create Vendor
        $vendor_data = $user->vendor()->create($vendor_data);
        Mail::to($user['email'])->send(new UserCreatedUserMail($user));

        return new VendorUser($user);
    }

    public function update(Update $request, $id)
    {
        $user_data = collect($request->validated())->only(collect((new UpdateRegular)->rules())->keys()->push('email'))->toArray();
        $user = User::find($id);
        $user->update($user_data);
        if ($user->is_vendor()) {
            $vendor_data = collect($request->validated())->except(collect((new UpdateRegular)->rules())->keys())->toArray()['vendor'];
            if ($request->has('vendor.logo')) {
                $image = $request->file('vendor.logo');
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
                $vendor_data['logo'] = Storage::url('public/users/' . $fileName);
            }
            $user->vendor()->update(collect($vendor_data)->except(['seller_identity', 'commerical_registeration', 'tax_id', 'vat', 'rental_document', 'national_id'])->toArray());
            if ($request->has('vendor.seller_identity')) {
                foreach ($request->file('vendor.seller_identity') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'Seller Identity']);
                }
            }
            if ($request->has('vendor.commerical_registeration')) {
                foreach ($request->file('vendor.commerical_registeration') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'Commerical Registeration']);
                }
            }

            if ($request->has('vendor.tax_id')) {
                foreach ($request->file('vendor.tax_id') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'Tax Indentity']);
                }
            }
            if ($request->has('vendor.vat')) {
                foreach ($request->file('vendor.vat') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'VAT']);
                }
            }
            if ($request->has('vendor.national_id')) {
                foreach ($request->file('vendor.national_id') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'National ID']);
                }
            }
            if ($request->has('vendor.rental_document')) {
                foreach ($request->file('vendor.rental_document') as $image) {
                    $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                    $image = Storage::put('public/products/vendors/' . Auth::id() . '/' . $fileName, file_get_contents($image), 'public');
                    $user->vendor->images()->create(['url' => Storage::url('public/vendors/' . $id . '/' . $fileName), 'description' => 'Rental Document']);
                }
            }

            if ($vendor_data['status'] == 'Draft') {
                $user->products()->update(['status' => 'Draft']);
            }
            if ($vendor_data['status'] == 'Trash') {
                $user->products()->update(['status' => 'Trash']);
            }
//            if ($vendor_data['status'] == 'Active') {
//                $user->products()->update(['status' => 'Published']);
//            }
        }

        return new VendorUser($user);
    }
}
