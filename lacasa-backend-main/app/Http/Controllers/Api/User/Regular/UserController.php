<?php

namespace App\Http\Controllers\Api\User\Regular;

use App\Enums\DesignerStatusType;
use App\Http\Controllers\Api\User\AuthenticationController;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Regular\Create;
use App\Http\Requests\User\Regular\Update;
use App\Http\Resources\User\RegularUser;
use App\Mail\User\User\Verification as UserVerificationMail;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use Mail;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['only' => ['profile', 'updateProfile']]);
    }

      public function index()
      {
          return RegularUser::collection(QueryBuilder::for(User::class)
            ->withCount(['orders' => function (Builder $query) {
                $query
                ->where('status', '!=', 'Returned')
                ->where('status', '!=', 'Rejected')
                ->where('status', '!=', 'Refunded')
                ->where('status', '!=', 'Delivered failed')
                ->where('status', '!=', 'Cancelled');
            }, ])
            ->allowedFilters([
                'name',
                'email',
                'phone',
                'roles.name',
            ])
              ->defaultSort('-id')
              ->allowedSorts([
                  'id',
                  'name',
                  'email',
                  'phone',
                  'orders_count',
              ])->paginate()
          );
      }

      public function show($id)
      {
          return new RegularUser(User::find($id));
      }

      public function store(Create $request)
      {
          $user = User::create($request->validated());
            $auth = new AuthenticationController();
            $auth->sendUserVerificationMail($request->validated()['email'],$user);
          return new RegularUser($user);
      }

      public function update(Update $request, $id)
      {
          User::findorfail($id)->update($request->validated());

          return new RegularUser(User::find($id));
      }

    public function changeStatus(User $user,Request $request)
    {
        $validated = $request->validate([
            'status' => ['required',Rule::in(0,1)],
        ]);

        $user->update(
            ['block' => $request->status]
        );

        return response()->json([
            'code' => 200,
            'status' => __('success'),
            'message' => __('status change success'),
            'errors' => '',
        ], 200);
    }
}
