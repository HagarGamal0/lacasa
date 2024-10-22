<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;

class CheckAdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('sanctum')->user()) {
            if (request()->headers->get('origin') == config('app.dashboard_url') && Auth::guard('sanctum')->user()->roles()->count() == 0) {
                abort(403, 'Access denied');
            }
        }

        return $next($request);
    }
}
