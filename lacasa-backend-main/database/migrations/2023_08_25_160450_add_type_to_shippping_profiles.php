<?php

use App\Enums\ShippingProfileType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shipping_profiles', function (Blueprint $table) {
            $table->enum('type',[ShippingProfileType::Light,ShippingProfileType::Heavey])->after('name')->default(ShippingProfileType::Heavey);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shipping_profiles', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
