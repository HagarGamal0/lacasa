<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ProjectScopeEnum extends Enum
{
    const Architecture                    = 1;
    const InteriorDesign                  = 2;
    const FurnitureSelection              = 3;
    const Landscape                       = 4;
    const UrbanDesign                     = 5;
    const ProductDesign                   = 6;
    const ArchitecturalModifications      = 7;
    const InteriorFinishes                = 8;
    const Styling                         = 9;

    public static function getProjectScope($type){
        if($type != 0){
            $types=[
                1 => __('Architecture'),
                2 => __('InteriorDesign'),
                3 => __('FurnitureSelection'),
                4 => __('Landscape'),
                5 => __('UrbanDesign'),
                6 => __('ProductDesign'),
                7 => __('ArchitecturalModifications'),
                8 => __('InteriorFinishes'),
                9 => __('Styling'),
            ];
    
            return $types[$type];
        }
       
    }

    public static function ProjectScopeList(){
        $types=[
            1 => __('Architecture'),
            2 => __('InteriorDesign'),
            3 => __('FurnitureSelection'),
            4 => __('Landscape'),
            5 => __('UrbanDesign'),
            6 => __('ProductDesign'),
            7 => __('ArchitecturalModifications'),
            8 => __('InteriorFinishes'),
            9 => __('Styling'),
        ];

        return $types;
    }
}
