<?php

namespace App\Http\Middleware;

use App\Models\Catalog\Product\Product;
use App\Models\Catalog\Product\Traffic;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use DB;
class TrafficMonitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\ITrafficlluminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    // public function handle(Request $request, Closure $next)
    // {
    //     return $next($request);
    // }

    public function handle($request, Closure $next)
    {
        $time = now();

        $visitor = $request->ip();

        if (Route::currentRouteName() == 'products.show') {
            $trafficable = $request->route('product');
            // DB::enableQueryLog();
            $trafficable_id = Product::slug($trafficable)->firstorfail()->id;
            // dd(DB::getQueryLog()); 
            $trafficable_type = 'App\Models\Catalog\Product\Product';
        }

      
        $traffic = Traffic::where('ip', $visitor)->where('trafficable_type', $trafficable_type)->first();
      
        if ($traffic) {
            // Resident visitor
            $traffic->visits++;
            $traffic->update();
        } else {
            // New visitor
            $traffic = new Traffic([
                'ip' => $visitor,
                'trafficable_id' => $trafficable_id,
                'trafficable_type' => $trafficable_type,
                'visits' => 1,
                'date' => now(),
            ]);
            $traffic->save();

            // Email notification
            // \Mail::raw("There is a new visitor at {$time} from ip {$visitor}.\nIn total there are {$totalVisitors} visitors, and over all you have {$totalTraffic} visits.", function ($note) {
            //     $note->to('manager@mail.com');
            // });
        }

        return $next($request);
    }
}
