<?php

namespace App\Http\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class ViewsSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';
        $query->orderByRaw("if(`order` is null ,`clicks`,`order`) {$direction}");
    }
}
