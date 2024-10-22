<?php

use App\Enums\DesignerStatusType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('designers', function (Blueprint $table) {
            $table->enum('status', [DesignerStatusType::Pending,DesignerStatusType::Active,DesignerStatusType::Suspend,DesignerStatusType::Draft])->default(DesignerStatusType::Pending)->change();
        });

        DB::statement('UPDATE `designers` SET `status` = "1" ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('designers', function (Blueprint $table) {
            //
        });
    }
};
