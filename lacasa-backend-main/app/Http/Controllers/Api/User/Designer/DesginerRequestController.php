<?php

namespace App\Http\Controllers\Api\User\Designer;

use App\Enums\RequestImagetypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangeStatusRequest;
use App\Http\Requests\User\Designer\Request\CreateDesignerRequest;
use App\Http\Resources\DesignerRequestResource;
use App\Mail\Admin\Request\RequestEmail;
use App\Models\User\Designer;
use App\Models\User\Designer\DesignerRequest;
use App\Models\User\Designer\DesignerRequestProject;
use App\Models\User\User;
use App\Traits\GeneralResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\QueryBuilder\QueryBuilder;

class DesginerRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['only' => ['changeStatus', 'all']]);
    }

    public function index(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        return DesignerRequestResource::collection(QueryBuilder::for(DesignerRequest::with(['projectsScope', 'drawings', 'inspirations']))
            ->allowedIncludes([
                'projectsScope',
                'drawings',
                'inspirations',
                'user',
                'designer',
            ])
            ->allowedFilters([
                'status',
            ])
            ->allowedSorts([
                'id',
                'status',
            ])->paginate($pagination));
    }

    public function all(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        if (!Auth::guard('sanctum')->user()->designer) {
            return GeneralResponse::responseMessage(__('error'), __('User not designer'), 400, null, null);
        }
        $designerId = Auth::guard('sanctum')->user()->designer->id;
        return DesignerRequestResource::collection(QueryBuilder::for(DesignerRequest::where('designer_id', $designerId)->with(['projectsScope', 'drawings', 'inspirations']))
            ->allowedIncludes([
                'projectsScope',
                'drawings',
                'inspirations',
                'user',
                'designer',
            ])
            ->allowedFilters([
                'status',
            ])
            ->allowedSorts([
                'id',
                'status',
            ])->paginate($pagination));
    }

    public function show(DesignerRequest $DesignerRequest)
    {
        return new DesignerRequestResource($DesignerRequest);
    }

    public function store(CreateDesignerRequest $request)
    {
        $userId = Auth::guard('sanctum')->user()?->id ?? null;
        $designer = Designer::where('user_id', $request->designer_id)->first();
        $desginerRequest = DesignerRequest::create([
                'user_id' => $userId,
                'designer_id' => $designer->id,
                'project_sector' => $request->project_sector,
                'project_location' => $request->project_location,
                'project_area' => $request->project_area,
                'project_descreption' => $request->project_descreption,
                'desired_service' => $request->desired_service,
                'style_descreption' => $request->style_descreption ?? '',
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'phone_communication' => $request->phone_communication,
                'email_communication' => $request->email_communication,
                'whatsapp_communication' => $request->whatsapp_communication,
                'f_10_to_5_am' => $request->f_10_to_5_am,
                'f_5_to_10_am' => $request->f_5_to_10_am,
                'f_10_to_5_pm' => $request->f_10_to_5_pm,
                'f_5_to_10_pm' => $request->f_5_to_10_pm,
            ]
        );


        if ($request->file('drawing')) {
            foreach ($request->file('drawing') as $image) {
                $fileName = \Str::random(6) . '-' . $image->getClientOriginalName();
                $image = \Storage::put('public/requests/' . $desginerRequest->id . '/' . $fileName, file_get_contents($image), 'public');
                $desginerRequest->images()->create(['url' => \Storage::url('public/requests/' . $desginerRequest->id . '/' . $fileName), 'type' => RequestImagetypeEnum::Drawing]);
            }
        }

        if ($request->file('inspirations')) {
            foreach ($request->file('inspirations') as $image) {
                $fileName = \Str::random(6) . '-' . $image->getClientOriginalName();
                $image = \Storage::put('public/requests/' . $desginerRequest->id . '/' . $fileName, file_get_contents($image), 'public');
                $desginerRequest->images()->create(['url' => \Storage::url('public/requests/' . $desginerRequest->id . '/' . $fileName), 'type' => RequestImagetypeEnum::Inspiration]);
            }
        }

        if ($request->project_scope != "") {
            $projectScopes = explode(",", $request->project_scope);
            if (is_array($projectScopes) && !empty($projectScopes)) {
                foreach ($projectScopes as $project) {
                    if ($project > 0) {
                        DesignerRequestProject::updateOrCreate(
                            ['designer_request_id' => $desginerRequest->id, 'project_id' => $project],
                            ['designer_request_id' => $desginerRequest->id, 'project_id' => $project]
                        );
                    }

                }
            }
        }
        User::Role('Super Admin')->chunk(500, function ($chunk) use ($desginerRequest) {
            foreach ($chunk as $item) {
                \Mail::to($item->email)->send(new RequestEmail($desginerRequest));
            }
        });
        return new DesignerRequestResource($desginerRequest);
    }

    public function changeStatus(DesignerRequest $DesignerRequest, ChangeStatusRequest $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type == "Designer" && $user->designer->id != $DesignerRequest['designer_id']) {
            return GeneralResponse::responseMessage(__('error'), __('Cannot Change status') . ' ' . __('you are not same desginer'), 400, null, null);
        }
        if ($user->user_type == "Regular" && $user->roles()->count() == 0) {
            return GeneralResponse::responseMessage(__('error'), __('Cannot Change status') . ' ' . 'is_Regular' . $user->roles()->count(), 400, null, null);
        }
        if ($user->user_type == "Vendor") {
            return GeneralResponse::responseMessage(__('error'), __('Cannot Change status') . 'is_vendors', 400, null, null);
        }
        $DesignerRequest->status = $request->status;
        $DesignerRequest->save();

        return GeneralResponse::responseMessage(__('success'), __('status change success'), 200, null, null);

    }


}
