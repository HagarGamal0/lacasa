<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

   'paths' => ['api/*', 'v1/*', 'sanctum/csrf-cookie'],// Specify the paths for your API
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'allowed_origins_patterns' => [],
    // 'allowed_headers' => ['Content-Type, X-Auth-Token, Authorization, X-Requested-With, X-Localization'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,


];

