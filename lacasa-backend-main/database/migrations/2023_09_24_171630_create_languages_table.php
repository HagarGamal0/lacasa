<?php

use App\Enums\StatusType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name','50');
            $table->string('locale','10');
            $table->boolean('status')->default(StatusType::Active);
            $table->timestamps();
        });

        DB::table("languages")->insert([[
            'name' => 'العربية',
            'locale' => 'ar',
            'status' => 1,
        ],
        [
            'name'      => 'English',
            'locale' => 'en',
            'status'    => 1,
        ]]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('languages');
    }
};
