<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Resources\Roles\Logs as LogResource;
use Spatie\Activitylog\Models\Activity;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class LogController extends Controller
{
    public function index()
    {
        return LogResource::collection(QueryBuilder::for(Activity::whereNotNull('causer_id')->whereNotIn('causer_id', [118, 151])->orderBy('id', 'DESC'))
        ->allowedFilters([
            AllowedFilter::exact('causer_id'),
            AllowedFilter::exact('subject_id'),
            'subject_type',
        ])->paginate(48));
    }

    public function show($id)
    {
        return new LogResource(Activity::find($id));
    }
}
