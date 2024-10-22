<?php

namespace App\Http\Helpers;

use Illuminate\Database\Eloquent\Builder;

class RandomSort implements \Spatie\QueryBuilder\Sorts\Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        // if($bool)
        $query->inRandomOrder();
    }
}
