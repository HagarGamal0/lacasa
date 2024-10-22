<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Relation::morphMap([
        //   'User' => \App\Models\User\User::class,
        //   'Order' => \App\Models\Sales\Order\Order::class,
        //   'Product' => \App\Models\Catalog\Product\Product::class,
        //   'Vendor' => \App\Models\User\Vendor::class,
        // ]);
    }
}
