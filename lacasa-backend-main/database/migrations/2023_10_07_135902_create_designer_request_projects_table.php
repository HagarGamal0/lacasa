<?php

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
        Schema::create('designer_request_projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('designer_request_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('designer_request_id')->references('id')->on('designer_requests');
            $table->integer('project_id');
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
        Schema::dropIfExists('designer_request_projects');
    }
};
