<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\DesiredServiceEnum;
use App\Enums\RequestStatustypeEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('designer_requests', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('user_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('designer_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('designer_id')->references('id')->on('designers');

            $table->integer('project_sector');
            $table->string('project_location');
            $table->integer('project_area');
            $table->text('project_descreption');
            $table->enum('desired_service',[DesiredServiceEnum::Consultancy,DesiredServiceEnum::Contracting])->default(DesiredServiceEnum::Consultancy);
            $table->text('style_descreption');

            $table->string('name');
            $table->string('email');
            $table->string('phone',15);
            $table->boolean('phone_communication')->default(0);
            $table->boolean('email_communication')->default(0);
            $table->boolean('whatsapp_communication')->default(0);
            $table->boolean('f_10_to_5_am')->default(0);
            $table->boolean('f_5_to_10_am')->default(0);
            $table->boolean('f_10_to_5_pm')->default(0);
            $table->boolean('f_5_to_10_pm')->default(0);
            $table->enum('status',[RequestStatustypeEnum::Pending,RequestStatustypeEnum::Contacted,RequestStatustypeEnum::Closed])->default(RequestStatustypeEnum::Pending);
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
        Schema::dropIfExists('designer_request');
    }
};
