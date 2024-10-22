<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::feeds('feed');

Route::get('/test', function () {
    $response = Http::get('http://127.0.0.1:8000/v1/products?page=5&paginate=8');

    return $response;

    return 'return';
});

Route::get('/rss/products.xml/{product?}', '\App\Http\Controllers\Rss\ProductController@index');
Route::get('/rss/products.csv', '\App\Http\Controllers\Api\Catalog\Product\ExportController@export');
Route::get('/rss/vendor_products.csv', '\App\Http\Controllers\Api\Catalog\Product\ExportController@exportByVendor');
Route::get('/mailable', function () {
    $order = App\Models\Sales\Order\Order::find(30);

    return new App\Mail\User\Order\Created($order);
});


Route::post('send/verify/{id}', '\App\Http\Controllers\Api\User\AuthenticationController@sendVerificationEmail');
Route::get('email/verify/{id}', '\App\Http\Controllers\Api\User\AuthenticationController@verifyEmail')->name('verification.verify');
