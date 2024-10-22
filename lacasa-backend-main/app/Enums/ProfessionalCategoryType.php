<?php
namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProfessionalCategoryType extends Enum
{
    const Trash  = 0;
    const Designer  = 1;
    const Supplier  = 2;

    public static function getProfessionalCategoryType($type){
        $types=[
            0 => __('Trash'),
            1 => __('Designer'),
            2 => __('Supplier'),
        ];

        return $types[$type] ?? null;
    }
}
