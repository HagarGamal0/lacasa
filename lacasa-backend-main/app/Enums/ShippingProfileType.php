<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ShippingProfileType extends Enum
{
    const Light  = 1;
    const Heavey = 2;

    public static function getShippingProfileType($type){
        $types=[
            1 => __('Light'),
            2 => __('Heavey'),
        ];

        return $types[$type];
    }
}
