<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn('usage_type');
            $table->dropColumn('no_of_usage');
            $table->dropColumn('has_categories');
            $table->dropColumn('has_vendors');
        });
    }

    public function down()
    {
        //
    }
};
