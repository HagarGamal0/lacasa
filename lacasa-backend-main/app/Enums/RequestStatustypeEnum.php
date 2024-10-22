<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class RequestStatustypeEnum extends Enum
{
    const Pending = 1;
    const Contacted = 2;
    const Closed = 3;

    public static function getType($type):string
    {
        $types=[
            1 => __('Pending'),
            2 => __('Contacted'),
            3 => __('Closed'),
        ];

        return $types[$type];
    }
}
