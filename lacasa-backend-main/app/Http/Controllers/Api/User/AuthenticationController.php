<?php

namespace App\Http\Controllers\Api\User;

use App\Exceptions\InvalidLogin;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Authentication as AuthenticateRequest;
use App\Http\Requests\User\Reset as ResetRequest;
use App\Http\Resources\User\RegularUser;
use App\Mail\User\User\Reset as ResetMail;
use App\Models\User\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Mail;
use Str;
use App\Http\Resources\Roles\Role as RoleResource;
use App\Traits\GeneralResponse;
use Illuminate\Auth\Access\AuthorizationException;
use PharIo\Manifest\Url;
use App\Mail\User\User\Verification as UserVerificationMail;
class AuthenticationController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum', ['only' => ['profile']]);
    }

    public function authenticate(AuthenticateRequest $request)
    {
        $credentials = $request->validated();
        if (Auth::attempt($credentials)) {
            if (Auth::user()->roles()->count() == 0 && request()->headers->get('origin') == config('app.dashboard_url')) {
                return GeneralResponse::responseMessage(__('lang.success'),__('lang.Accesss denied') . Auth::user()->roles()->count(),403);
            }
            return $this->login(Auth::user(), $request);
        } else {
            return GeneralResponse::responseMessage(__('lang.Unauthorized'),__('lang.Invalid email or password.'),401);
        }
    }

    public function login($user, $request)
    {
        $accessToken = $user->createToken($user->id);

        $data = [
            'user' => new RegularUser($user),
            'access_token' => $accessToken->plainTextToken,
            'roles' => RoleResource::collection(Auth::user()->roles)
        ];
        return GeneralResponse::responseMessage(__('lang.success'),__('lang.login_success'),200,$data);
    }

    public function reset(ResetRequest $request)
    {
        // $user = User::where('email', $request->validated()['email'])->first();
        if (empty($request->validated()['reset_token'])) {
            $user = User::where('email', $request->validated()['email'])->first();
            $reset_token = Str::random(64);
            $user->update(['reset_token' => $reset_token]);

            $this->sendUserVerificationMail($request->validated()['email'],$user,'rest');

            return [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.email was sent succesfully to',['value'=> $request->validated()['email']]),
            ];
        }if (empty($request->validated()['password'])) {
            return [
                'code' => 200,
                'status' => __('lang.success'),
                'message' => __('lang.PasswordExpird'),
            ];
        } else {
            $user = User::where('reset_token', $request->validated()['reset_token'])->first();
            $user->update(['password' => $request->validated()['password'], 'reset_token' => null]);
            $user->tokens()->delete();

            $accessToken = $user->createToken($user->id);

            return response()->json([
                'code' => 200,
                'status' =>  __('lang.success'),
                'data' => [
                    'user' => new RegularUser($user),
                    'access_token' => $accessToken->plainTextToken,
                ],
            ]);
        }
    }

      public function validateEmail(Request $request)
      {
          $request->validate([
              'email' => 'required|email:rfc,dns|unique:users',
              'password' => ['required', 'confirmed', Password::min(8)->uncompromised()],
          ] ,
          [
              'email.required'        =>__('validation.required',['attribute'=>__('lang.email')]),
              'email.email'           =>__('validation.email',['attribute'=>__('lang.email')]),
              'email.unique'          =>__('validation.unique',['attribute'=>__('lang.email')]),
              'password.required'     =>__('validation.required',['attribute'=>__('lang.password')]),
              'password.confirmed'    =>__('validation.confirmed',['attribute'=>__('lang.password')]),
          ]


        );

          return [
              'status' => __('lang.success'),
              'message' => __('lang.emailAndPasswordValid'),
          ];
      }


      public function verifyEmail(Request $request)
      {
          $userId = $request->route('id');
          $user = User::findOrFail($userId);
          if (!$user->hasVerifiedEmail()) {
              $user->markEmailAsVerified();
          }
          if($request->from == 'order'){
            $Url = '/page/account/checkout';
          }else{
            $Url = '/page/account/login?prevURL=%2F';
          }

          return redirect(config('app.front_url').$Url);
      }

    public function sendVerificationEmail(User $user,$from = 'login')
    {
         if ($user->block == 1){
             $message = __('lang.email_is_blocked');
             $errors = ['email_is_blocked' => $message];
             return GeneralResponse::responseMessage('error',$message,400,null,$errors);
         }
         $this->sendUserVerificationMail($user->email,$user);
          if($from == 'login'){
            $message = __('lang.Your mail not Verified  please check mail message to verified');
          }else{
            $message = __('lang.Please check your Email to verifiy your account to continue your order');
          }

         $errors = [
            'email_is_blocked' => $message,
        ];
          return GeneralResponse::responseMessage('error',$message,400,null,$errors);
    }



    public function sendUserVerificationMail($email , User $user ,$type = ""){

        try{
            if($type == 'rest'){
                Mail::to($email)->send(new ResetMail($user));
            }else{
                Mail::to($email)->send(new UserVerificationMail($user));
            }

        }catch (\Exception $e){
            return false;
        }

    }
}
