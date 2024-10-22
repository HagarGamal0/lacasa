<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;


final class DesiredServiceEnum extends Enum
{
    const Consultancy = 1;
    const Contracting = 2;

    public static function getDesiredService($type){
        $types=[
            1 => __('Consultancy'),
            2 => __('Contracting'),
        ];

        return $types[$type];
    }

    public static function DesiredServiceList(){
        $types=[
            1 => __('Consultancy'),
            2 => __('Contracting'),
        ];

        return $types;
    }
}
