# Project Title

Lacasa Back-end

## Description
The E-Commerce Backend Project is a powerful and robust platform designed to handle the backend operations of an online e-commerce store. It is built using the Laravel framework, providing a scalable and reliable solution to manage and control the essential functionalities of an e-commerce business.

## Main Features
- **Product Management**: Easily manage a wide range of products, including adding, editing, and deleting product information, categories, and inventory levels.
- **Order Processing**: Efficiently handle the order processing workflow, from order placement to order fulfillment and shipment tracking.
- **Multi-Vendor Support**: Enable multiple vendors to register and manage their own storefronts, products, and orders within the platform.
- **Discounts and Promotions**: Create and manage discounts, coupons, and promotions to attract more customers and boost sales.
- **User Authentication and Authorization**: Securely authenticate users and provide role-based access control to ensure only authorized personnel can access specific parts of the backend.
- **Customer Management**: Keep track of customer information, order history, and customer interactions to enhance the shopping experience.
- **Inventory Control**: Monitor and manage inventory levels, including real-time updates on stock availability and automatic alerts for low stock items.
- **Payment Integration**: Seamlessly integrate with popular payment gateways to facilitate secure and smooth transactions.
- **Shipping Integration**: Integrate with shipping providers to calculate shipping costs and provide real-time tracking information to customers.
- **Reporting and Analytics**: Generate comprehensive reports and analytics to gain valuable insights into sales performance, customer behavior, and product popularity.
## Tech Stack

The project uses the following technologies and packages:

- PHP v8.2
- [fruitcake/laravel-cors](https://github.com/fruitcake/laravel-cors) v2.0
- [guzzlehttp/guzzle](https://github.com/guzzle/guzzle) v7.0.1
- [intervention/validation](https://github.com/Intervention/validation) v3.2
- [laravel/framework](https://github.com/laravel/framework) v9.0
- [laravel/helpers](https://github.com/laravel/helpers) v1.5
- [laravel/sanctum](https://github.com/laravel/sanctum) v2.11
- [laravel/tinker](https://github.com/laravel/tinker) v2.5
- [league/flysystem-aws-s3-v3](https://github.com/thephpleague/flysystem-aws-s3-v3) ~3.0
- [maatwebsite/excel](https://github.com/Maatwebsite/Laravel-Excel) v3.1
- [psr/simple-cache](https://github.com/php-fig/simple-cache) v1.0
- [spatie/eloquent-sortable](https://github.com/spatie/eloquent-sortable) v4.0
- [spatie/laravel-activitylog](https://github.com/spatie/laravel-activitylog) v4.5
- [spatie/laravel-permission](https://github.com/spatie/laravel-permission) v5.5
- [spatie/laravel-query-builder](https://github.com/spatie/laravel-query-builder) v5.0
- [spatie/laravel-sluggable](https://github.com/spatie/laravel-sluggable) v3.3.0
- [symfony/http-client](https://github.com/symfony/http-client) v6.0

## Environment Variables

To run this project, you need to set the following environment variables: (Required)

- `APP_URL=`
- `FRONT_URL=`
- `DASHBOARD_URL=`
- `ORANGE_COUNTRY_ID=`
- `ORANGE_OWNER_ID=`
- `ORANGE_STATION_ID=`
- `PAYMOB_USERNAME=`
- `PAYMOB_PASSWORD=`
- `DO_SPACES_KEY=`
- `DO_SPACES_SECRET=`
- `DO_SPACES_ENDPOINT=`
- `DO_SPACES_REGION=`
- `DO_SPACES_BUCKET=`  
## How to Install and Run Development Server

Follow these steps to install and run the Laravel project:

1. Clone the repository to your local machine:
`git clone https://github.com/your-username/lacasa.git`
2. Navigate to the project directory:
`cd lacasa`
3. Install Composer dependencies:
`composer install`
4. Copy the `.env.example` file to `.env`:
`cp .env.example .env`
5. Set the required environment variables in the `.env` file.
6. Generate the application key:
`php artisan key:generate`
7. Run the migrations and seed the database (if needed):
`php artisan migrate --seed`
8. Start the development server:
`php artisan serve`
9. The project should now be running at `http://localhost:8000`.

## List of Contributors

- [thegreataint](https://github.com/thegreataint) - Mohamed Abu El-Nour
- [minamounir018](https://github.com/minamounir018) - Mina Mounir
