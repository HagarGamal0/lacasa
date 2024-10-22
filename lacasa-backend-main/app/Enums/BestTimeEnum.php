<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class BestTimeEnum extends Enum
{
    const F10To5AM = 1;
    const F5To10AM = 2;
    const F10To5Pm = 3;
    const F5To10Pm = 4;

    public static function getBestTime($type){
        $types=[
            1 => __('F10To5AM'),
            2 => __('F5To10AM'),
            3 => __('F10To5Pm'),
            4 => __('F5To10Pm'),
        ];

        return $types[$type];
    }

    public static function BestTimeList(){
        $types=[
            1 => __('F10To5AM'),
            2 => __('F5To10AM'),
            3 => __('F10To5Pm'),
            4 => __('F5To10Pm'),
        ];
        return $types;
    }
}
