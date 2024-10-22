<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ProfessionalCategoryType;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('designer_categories', function (Blueprint $table) {
            $table->enum('type',[ProfessionalCategoryType::Designer,ProfessionalCategoryType::Supplier])->after('name')->default(ProfessionalCategoryType::Designer);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('designer_categories', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
