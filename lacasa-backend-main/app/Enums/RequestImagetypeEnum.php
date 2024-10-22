<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class RequestImagetypeEnum extends Enum
{
    const Drawing = 1;
    const Inspiration = 2;

    public static function getImagetype($type){
        $types=[
            1 => __('Drawing'),
            2 => __('Inspiration'),
        ];

        return $types[$type];
    }
}
