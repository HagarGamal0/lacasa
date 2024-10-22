<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CommunicationEnum extends Enum
{
    const Phone    = 1;
    const Email    = 2;
    const Whatsapp = 3;

    public static function getCommunication($type){
        $types=[
            1 => __('Phone'),
            2 => __('Email'),
            3 => __('Whatsapp'),
        ];

        return $types[$type];
    }

    public static function CommunicationList(){
        $types=[
            1 => __('Phone'),
            2 => __('Email'),
            3 => __('Whatsapp'),
        ];
        return $types;
    }
}
