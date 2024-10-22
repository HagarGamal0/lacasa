<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class DesignerStatusType extends Enum
{
    const Pending  = '1';
    const Active   = '2';
    const Suspend   = '3';
    const Draft    = '4';


    public static function getType($type):string
    {
        $types=[
            1 => __('Pending'),
            2 => __('Active'),
            3 => __('Suspend'),
            4 => __('Draft'),
        ];

        return $types[$type];
    }
}
