<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\RequestImagetypeEnum;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('designer_request_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('designer_request_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('designer_request_id')->references('id')->on('designer_requests');
            $table->enum('type',[RequestImagetypeEnum::Drawing,RequestImagetypeEnum::Inspiration]);
            $table->string('url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('designer_request_images');
    }
};
