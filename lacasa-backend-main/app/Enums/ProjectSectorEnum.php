<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProjectSectorEnum extends Enum
{
    const Residential     = 1;
    const Commercial      = 2;
    const Corporate       = 3;
    const Education       = 4;
    const Hospitality     = 5;
    const FoodAndBeverage = 6;
    const Other           = 7;

    public static function getProjectSector($type){
        $types=[
            1 => __('Residential'),
            2 => __('Commercial'),
            3 => __('Corporate'),
            4 => __('Education'),
            5 => __('Hospitality'),
            6 => __('FoodAndBeverage'),
            7 => __('Other'),
        ];

        return $types[$type];
    }

    public static function ProjectSectorList(){
        $types=[
            1 => __('Residential'),
            2 => __('Commercial'),
            3 => __('Corporate'),
            4 => __('Education'),
            5 => __('Hospitality'),
            6 => __('FoodAndBeverage'),
            7 => __('Other'),
        ];

        return $types;
    }
}
