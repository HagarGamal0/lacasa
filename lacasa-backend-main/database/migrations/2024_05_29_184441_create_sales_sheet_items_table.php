<?php

use App\Models\SalesSheet;
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
        Schema::create('sales_sheet_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(SalesSheet::class)->constrained()->onDelete('CASCADE');
            $table->unsignedInteger('order_id');
            $table->string('vendor_name');
            $table->string('net');
            $table->double('commission');
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
        Schema::dropIfExists('sales_sheet_items');
    }
};
