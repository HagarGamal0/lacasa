<?php
use app\Http\Controllers\Api\Catalog\Product\ProductController;

use App\Http\Controllers\Api\Gallery\GalleryController;
use App\Http\Controllers\Api\Sales\SalesSheetController;
use App\Http\Controllers\Api\Translate\TranslateController;
use App\Http\Controllers\Api\User\Designer\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */
Route::middleware('localization')->group( function () {
    // Dynamic Data
     Route::namespace('General')->group(function () {

         Route::get('languages','LanguagesController@index');

     });

    Route::middleware(['CheckAdminAuth'])->group(function () {
        // Dynamic Data



        Route::get('products/show48h', 'Catalog\Product\ProductController@show48h');
        Route::get('products/Bundle', 'Catalog\Product\ProductController@showBundle');
        Route::get('products/freeShipping', 'Catalog\Product\ProductController@showFreeShipping');



        Route::namespace('DynamicData')->group(function () {
            // Dynamic Sections
            Route::ApiResources([
                'dynamic/{section_name}/items' => 'DynamicItemController',
                'dynamic/count-down' => 'CountBannerController',
            ]);
            Route::get('dynamic/{section_name}/banners/{name?}', 'DynamicItemController@banners');
        });

        // Forms
        Route::namespace('Forms')->group(function () {
            Route::get('contactus', 'ContactUsController@index');
            Route::post('contactus', 'ContactUsController@store');
            Route::get('campaigns', 'CampaignController@index');
            Route::post('campaigns', 'CampaignController@store');
        });

        // Catalog
        Route::namespace('Catalog')->group(function () {
            // Products
            Route::namespace('Product')->group(function () {
                Route::group(['prefix' => 'frontend'],function () {
                    Route::apiResource('products', 'Frontend\ProductController')->names([
                        'index' => 'frontend.products.index', // Assign a unique name
                    ]);
                });
                Route::ApiResources([
                    'products' => 'ProductController',
                    'products.reviews' => 'ProductReviewController',
                    'attributes' => 'AttributeController',
                ]);
                Route::post('products/storeDom', 'ProductController@storeDom');
                Route::post('import/products', 'ProductController@import');
                Route::get('reviews', 'ProductReviewController@index');
                Route::post('reviews/{review}/approve', 'ProductReviewController@approve');
                Route::post('reviews/{review}/reject', 'ProductReviewController@reject');
                Route::delete('reviews/{review}/delete', 'ProductReviewController@destroy');
                Route::get('products/iti', 'ProductController@iti');

                Route::post('products/{product}/duplicate', 'ProductController@duplicate');
                Route::get('products/{slug}/similar', 'ProductController@showSimilar');
                Route::post('bulk-update/products', 'ProductController@bulkUpdate');
                Route::get('rss/products.csv', 'ExportController@export');
                Route::get('export/products', 'ExportController@exportForAdmin');
                Route::post('vendors/{vendor_id}/reprice/{category?}', 'ProductController@reprice');
            });
            // Other Catalog Items
            Route::ApiResources([
                'categories' => 'CategoryController',
                'tags' => 'TagController',
            ]);
            Route::post('categories/{id}/reorder/{order_target}', 'CategoryController@moveOrder');
            Route::get('brands', 'BrandController@index');
        });
        // Sales
        Route::namespace('Sales')->group(function () {
            // Ofers
            Route::namespace('Offer')->group(function () {
                Route::ApiResources([
                    'coupons' => 'CouponController',
                    'flash_sales' => 'FlashSaleController',
                    'wheel_offers' => 'WheelController',
                    'flash_reprice' => 'FlashRepriceController',
                ]);
                Route::post('wheel_offers/{id}/win', 'WheelController@generate');
                Route::post('coupons/validate', 'CouponController@validateByName');
                Route::post('orange/redeem', 'RedeemOrangePointsController@redeem');
                Route::post('orange/redeem/voucher', 'RedeemOrangePointsController@purchase');
                Route::get('flash_sales/{profile_id}/products', 'FlashSaleController@products');
            });
            // Orders
            Route::namespace('Order')->group(function () {
                Route::ApiResources([
                    'orders/payment_methods' => 'PaymentMethodController',
                    'old_orders' => 'OldOrderController',
                    // 'orders' => 'OrderController',
                    'old_temp_orders' => 'TempOrderController',
                ]);
                // Orders
                Route::get('orders', 'OrderController@index');
                Route::get('orders/{id}', 'OrderController@show');
                Route::get('draft_orders', 'DraftOrderController@index');
                Route::get('draft_orders/{id}', 'DraftOrderController@show');
                Route::patch('orders/{order}', 'OrderController@update');
                Route::patch('orders/{order}/shipments/{shipment}', 'OrderController@updateShipment');
                Route::post('carts/{cart?}/calculate', 'OrderController@calculate');
                Route::post('carts/{cart?}/purchase', 'OrderController@store');
                // Exports
                Route::post('export/orders', 'ExportController@exportActive');
                Route::get('export/statements', 'ExportController@Statement');

                Route::post('export/old_orders', 'OldOrderController@exportActive');
                Route::post('export/old_abandoned-orders', 'ExportController@exportOldAbandoned');

                Route::get('statements', 'StatementController@index');
                Route::get('analytics/orders', 'AnalyticController@index');
                Route::get('analytics/old_orders', 'OldAnalyticController@index');
                // Old Orders
                Route::post('update_cart', 'OldOrderController@updateCart');
                Route::post('validate_cart', 'OldOrderController@validateCart');

                // Payment Gateway
                Route::post('orders/available_payment_methods', 'PaymentMethodController@getPaymentMethods');
                Route::post('paymob/callback/proccessed', 'PaymobController@callbackProccessed');
                Route::get('paymob/callback/response', 'PaymobController@callbackResponse');
                // Route::post('export/abandoned-orders', 'ExportController@exportAbandoned');
                // Route::post('orders/{order_id}/shipments', 'PickupController@store');
                // Route::get('test/trasnfare/{id}', 'PaymobController@test'); //TEMP: FOR TESTING
            });
            // Shipping
            Route::namespace('Shipping')->group(function () {
                Route::ApiResources([
                    'shipping_profiles' => 'ShippingProfileController',
                    'shipping_providers' => 'ShippingProviderController',
                ]);
                Route::get('shipping_profiles/{profile_id}/products', 'ShippingProfileController@products');
                Route::post('shipping_profiles/import', 'ShippingProfileController@importShippingProfiles');
            });
            Route::namespace('Cart')->group(function () {
                Route::get('carts/{cart?}/available_payment_methods', 'PaymentMethodController@index');
                Route::post('carts/{cart?}/validate_coupons', 'CouponController@validateByName');
                Route::get('carts/{cart?}', 'CartController@index');
                Route::post('carts/{cart?}', 'CartController@store');
                Route::delete('carts/{cart?}/items/{item_id}', 'CartController@destroy');
                Route::patch('carts/{cart?}/items/{item_id}', 'CartController@update');

                // Route::ApiResources([
                //   'carts/{cart}' => 'CartController',
                // ]);
            });
            Route::get('sales/sheet', [SalesSheetController::class, 'index']);
        });

        // Users
        Route::namespace('User')->group(function () {
            // Authentication And Global Users
            Route::get('profile', 'ProfileController@profile');
            Route::put('profile', 'ProfileController@updateProfile');
            Route::get('profile/permissions', 'ProfileController@getPermissions');
            Route::post('authenticate', 'AuthenticationController@authenticate');
            Route::post('validateEmail', 'AuthenticationController@validateEmail');

            Route::post('reset', 'AuthenticationController@reset');
            Route::ApiResources([
                'users.addressbooks' => 'UserAddressBookController', // CRUD User AddressBook For Admin
                'addressbooks' => 'ProfileAddressBookController', // CRUD Authenticated User AddressBook
            ]);

            // Regular Users
            Route::namespace('Regular')->group(function () {
                Route::ApiResources([
                    'users' => 'UserController', // CRUD Regular User
                    'profile/orders' => 'OrderController', // CRUD Authenticated User Orders
                ]);
                Route::post('users/change/status/{user}', 'UserController@changeStatus');
            });

            // Vendor Users
            Route::namespace('Vendor')->group(function () {
                Route::ApiResources([
                    'vendors' => 'UserController', // CRUD Vendor User
                    // 'vendor/shipping_fees' => 'ShippingFeeController', //CRUD Authenticated Vendor Shipping Fees
                    'vendor/shipping_profiles' => 'ShippingProfileController',
                    'vendor/orders' => 'OrderController', // CRUD Authenticated Vendor Recieved Orders
                    'vendor/products' => 'ProductController', // CRUD Authenticated Vendor Products
                    'vendors.products/shipping' => 'ShippingFeeController',
                ]);
                // Route::get('vendors/statements/finance', 'FinanceController@index');
                // Route::get('vendors/statements/finance/export', 'FinanceController@export');
                Route::get('vendors/orders/export', 'ExportController@orders');
                Route::get('vendors/products/export', 'ExportController@products');
                Route::get('vendors/statements/analytics', 'AnalyticController@index');
                Route::patch('vendor/orders/{order_id}/products/{product_id}/status', 'OrderController@updateStatus');
                Route::patch('vendor/orders/{order_id}/products/{product_id}', 'OrderController@update');
                Route::get('vendor/used_categories', 'ShippingFeeController@usedCategories');
            });

            // Designer User
            Route::namespace('Designer')->group(function () {

                Route::group(['prefix'=>'designers'],function (){
                    Route::ApiResources([
                        '/categories' => 'CategoryController', // CRUD Designer User
                        '/projects' => 'ProjectController', // CRUD Designer User
                    ]);
                    Route::get('/filter-data','UserController@filterData');
                    Route::post('/projects/admin/add', 'ProjectController@adminStore');
                    Route::get('/list/categories', 'CategoryController@list');
                    Route::get('/activeList', 'UserController@activeList');
                    Route::post('/request/add', 'DesginerRequestController@store')->middleware('throttle:api');
                    Route::get('/request/{DesignerRequest}', 'DesginerRequestController@show');
                    Route::post('/request/status/{DesignerRequest}', 'DesginerRequestController@changeStatus');
                    Route::get('/request', 'DesginerRequestController@all');
                    Route::get('/list/requests', 'DesginerRequestController@index');
                    Route::post('/change/status/{user}', 'UserController@changeStatus');
                    Route::get('/{id}', 'UserController@show');
                });
                Route::ApiResource('designers','UserController');

            });
            // OTP
            Route::post('request_otp', 'SMSVerificationController@sendOTP');
            Route::post('verify_otp', 'SMSVerificationController@verifyOTP');
        });

        // Cities and Areas
        Route::namespace('World')->group(function () {
            Route::ApiResources([
                'world/cities' => 'CityController',
                'world/cities.areas' => 'CityAreaController',
            ]);
        });

        // Roles Abd Permissions
        Route::namespace('Role')->group(function () {
            Route::ApiResources([
                'permissions' => 'PermissionController',
                'roles' => 'RoleController',
                // Tracking and Activity Logs
                'log_activity' => 'LogController',
            ]);
        });

        Route::namespace('Gallery')->prefix('Gallery')->group(function () {
            Route::post('/upload','GalleryController@uploadImages');
            Route::get('/', 'GalleryController@index');
        });

    });
});

Route::post('/translate', [TranslateController::class, 'translate']);
