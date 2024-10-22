<?php

namespace App\Http\Controllers\Api\User\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectCreateRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Http\Resources\User\Designer\Project as ProjectResource;
use App\Models\User\Designer;
use App\Models\User\DesignerProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth ;
use Storage;
use Str;
use App\Traits\GeneralResponse;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum'],['only' => ['store','destroy','update']]);
    }

    public function index(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        return ProjectResource::collection(QueryBuilder::for(DesignerProject::with(['designer','images']))
                    ->allowedFilters([
                        'id',
                        'title',
                        'designer.user_id',
                    ])
                    ->allowedSorts([
                        'id',
                        'title',
                    ])->orderBy('id','DESC')->paginate($pagination));
   }


    public function show(DesignerProject $project)
    {
        return new ProjectResource($project);
    }

    public function update(DesignerProject $project,ProjectUpdateRequest $request){
            $input =  $request->validated();
          $user  = Auth::guard('sanctum')->user();
          if($user->is_designer() && $user->designer->id !=  $project->designer_id){
            return  GeneralResponse::responseMessage(__('error'),__('Cannot edit Project') . $user->designer->id . '  '. __('you are not same desginer') .' ' . $project->designer_id,400,null,null);
          }elseif($user->user_type == "Regular" && $user->roles()->count() == 0){
            return  GeneralResponse::responseMessage(__('error'),__('Cannot Change status').' '.'is_Regular'.$user->roles()->count(),400,null,null);
          }elseif($user->is_vendor()){
            return  GeneralResponse::responseMessage(__('error'),__('Cannot edit edit')  . '  '. __('you are vender'),400,null,null);
          }

          $project->update(collect($input)->except(['images','_method'])->toArray());

          if($request->file('images')){
            $project->images()->delete();
            foreach ($request->file('images') as $image) {
                // $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                // $image = Storage::put('public/projects/' . $project->id . '/' . $fileName, file_get_contents($image), 'public');
                $project->images()->create(['url' => Storage::url($image->store('projects/' . $project->id)), 'description' => 'Project Image']);
              }
          }

        return new ProjectResource($project);
    }

    public function store(ProjectCreateRequest $request)
    {
        $project =  $request->validated();
        $user =Auth::guard('sanctum')->user()->designer;
        if(!$user){
            return  GeneralResponse::responseMessage(__('error'),__('User not designer'),400,null,null);
        }
        $project = $user->projects()->create(collect($project)->except(['images'])->toArray());
        foreach ($request->file('images') as $image) {
            
            // $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            // $image = Storage::put('public/projects/' . $project->id . '/' . $fileName, file_get_contents($image), 'public');
            $project->images()->create(['url' => Storage::url($image->store('projects/' . $project->id)), 'description' => 'Project Image']);
        }
        return new ProjectResource($project);
    }

    public function adminStore(ProjectCreateRequest $request)
    {
        $input =  $request->validated();
        $user    = Designer::where('user_id',$input['desginer_id']);

        $project = $user->first()->projects()->create(collect($input)->except(['images','desginer_id'])->toArray());
        foreach ($request->file('images') as $image) {
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/projects/' . $project->id . '/' . $fileName, file_get_contents($image), 'public');
            $project->images()->create(['url' => Storage::url('public/projects/' . $project->id . '/' . $fileName), 'description' => 'Project Image']);
        }
        return new ProjectResource($project);
    }

    public function destroy(DesignerProject $project){
        $user  = Auth::guard('sanctum')->user();
        if($user->user_type == "Designer" && $user->designer->id !=  $project->designer_id){
          return  GeneralResponse::responseMessage(__('error'),__('Cannot delete') . $user->designer->id . '  '. __('you are not same desginer') .' ' . $project->designer_id,400,null,null);
        }elseif($user->user_type == "Regular" && $user->roles()->count() == 0){
          return  GeneralResponse::responseMessage(__('error'),__('Cannot delete ').' '.__('you are Regular').$user->roles()->count(),400,null,null);
        }elseif($user->user_type == "Vendor"){
          return  GeneralResponse::responseMessage(__('error'),__('Cannot delete ')  . '  '. __('you are vender'),400,null,null);
        }
         DesignerProject::destroy($project->id);

        return  GeneralResponse::responseMessage(__('success'),__('Delete Success'),200,null,null);

    }
}
