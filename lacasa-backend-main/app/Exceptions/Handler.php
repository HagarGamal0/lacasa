<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;
use Sentry\Laravel\Integration;
class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            Integration::captureUnhandledException($e);
        });

        // $this->renderable(function (NotFoundHttpException $e, $request) {
        //         return response()->json([
        //             'message' => 'Record not found.',
        //             'e' => $e,
        //         ], 404);
        // });

        $this->renderable(function (Throwable $e, $request) {
            if ($e instanceof ModelNotFoundException && $request->expectsJson()) {
                return response()->json([
                    'code' => 444,
                    'status' =>__('lang.Not Found'),
                    'message' => __('lang.Requested API is not available.'),
                    'errors' => '',
                ], 404);
            } elseif ($e instanceof NotFoundHttpException && $request->expectsJson()) {
                return response()->json([
                    'code' => 404,
                    'status' => __('lang.Not Found'),
                    'message' => __('lang.Requested API is not available.'),
                    'errors' => '',
                ], 404);
            } elseif ($e instanceof ValidationException && $request->expectsJson()) {
                return response()->json([
                    'code' => $e->status,
                    'status' => __('lang.Unprocessable Entity'),
                    'message' => __('lang.The given data was invalid.'),
                    // 'errors' => collect($e->errors())->first(),
                    'errors' => collect($e->errors()),
                ], $e->status);
            } elseif ($e instanceof AuthenticationException && $request->expectsJson()) {
                return response()->json([
                    'code' => 401,
                    'status' => __('lang.Unauthorized.'),
                    'message' => __('lang.Unauthenticated.'),
                    // 'errors' => $e->errors(),
                ], 401);
            
            } elseif ($e instanceof AccessDeniedHttpException && $request->expectsJson()) {
                return response()->json([
                    'code' => 401,
                    'status' => __('lang.Unauthorized.'),
                    'message' => __('lang.Unauthenticated.'),
                    // 'errors' => $e->errors(),
                ], 401);
            }elseif($e instanceof ThrottleRequestsException) {
                return response()->json([
                    'code' => 429,
                    'status' => 'error',
                    'message' => __('lang.Too many requests. Please try again later.'),
                    'errors' => $e->errors(),
                ], 429);
            }
        });
    }
}
