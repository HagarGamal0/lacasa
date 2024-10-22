<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class StatusType extends Enum
{
    const Active  = 1;
    const Inactive = 0;

    public static function getShippingProfileType($type){
        $types=[
            0 => __('Light'),
            1 => __('Active'),
        ];

        return $types[$type];
    }
}
