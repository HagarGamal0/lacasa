<?php

namespace App\Http\Controllers\Api\User\Designer;

use App\Enums\DesignerStatusType;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Designer\Create;
use App\Http\Requests\User\Designer\Update;
use App\Http\Requests\User\Regular\Create as CreateRegular;
use App\Http\Requests\User\Regular\Update as UpdateRegular;
use App\Http\Resources\User\DesignerUser;
use App\Models\User\Designer;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Storage;
use Str;
use DB;
use App\Mail\User\User\Created as UserCreatedUserMail;
use Illuminate\Validation\Rule;
use Mail;
use function App\Http\Helpers\getLanguages;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['only' => ['profile', 'updateProfile']]);
    }

    public function activeList(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        $users = User::with('designer')->whereHas('Designer', function ($query) {
            $query->where('status', DesignerStatusType::Active);
        });
        return DesignerUser::collection(QueryBuilder::for($users)
            ->allowedFilters([
                'name',
                'id',
                'phone',
                'designer.categories.id',
                AllowedFilter::partial('company_name', 'designer.company_name'),
                AllowedFilter::partial('job_title', 'designer.job_title'),
                AllowedFilter::partial('status', 'designer.status'),
                AllowedFilter::partial('type', 'designer.type'),

                'email',

            ])
            ->allowedSorts([
                'id',
                'phone',
                'email',
                'name',
            ])->orderBy('id', 'DESC')->paginate($pagination));
    }

    public function index(Request $request)
    {
        $pagination = $request['paginate'] ?: '15';
        $q = QueryBuilder::for(User::with(['designer']))
            ->wherehas('designer', function (Builder $builder) use ($request) {
                $builder->when($request->input('status'), fn(Builder $query, $v) => $query->where('status', $v))
                    ->when($request->min_exp, fn($q, $v) => $q->where('experience', '>=', $v))
                    ->when($request->max_exp, fn($q, $v) => $q->where('experience', '<=', $v))
                    ->when($request->area,
                        fn($q, $v) => $q->where('area_id', $v), function (Builder $query) use ($request) {
                            $query->when($request->city, function (Builder $query, $v) {
                                $query->whereRelation('area', 'city_id', $v);
                            });
                        });
            })
            ->allowedFilters([
                'name',
                'id',
                'phone',
//                AllowedFilter::partial('company_name', 'designer.company_name'),
                AllowedFilter::partial('job_title', 'designer.job_title'),
                AllowedFilter::partial('status', 'designer.status'),
                AllowedFilter::partial('type', 'designer.type'),
                AllowedFilter::partial('category', 'designer.categories.id'),
                AllowedFilter::exact('area', 'designer.area_id'),
                'email',
            ])
            ->allowedSorts([
                'id',
                'phone',
                'email',
                'name',
            ])->orderBy('id', 'DESC')
            ->paginate($pagination);

        return DesignerUser::collection($q);
    }

    public function show($id)
    {
        return new DesignerUser(User::find($id));
    }

    public function store(Create $request)
    {
        $valid_request = $request->validated();

        $user_data = collect($valid_request)->only(collect((new CreateRegular)->rules())->keys())->toArray();
        $designer_data = collect($valid_request)->except(collect((new CreateRegular)->rules())->keys())->toArray();
        try {
            $user = User::create($user_data);
            $designer_data['avatar'] = !$request->file('avatar') ? null : Storage::url($request->file('avatar')->store('users/' . $user->id . '/avatar'));
            $designer_data['cover_photo'] = !$request->file('cover_photo') ? null : Storage::url($request->file('cover_photo')->store('users/' . $user->id . '/cover_photo'));

            $designer = $user->designer()->create(collect($designer_data)->except(['categories', 'designer_identity', 'commerical_registeration', 'tax_id', 'company_name', 'job_title', 'bio', 'address'])->toArray());
//            dd($designer);
            if (isset($request['categories'])) {
                $designer->categories()->attach($request['categories']);
            }
            if ($request->has('designer_identity')) {
                $fileName = Str::random(6) . '-' . $request->designer_identity->getClientOriginalName();
                $designer_identity_image = Storage::put('public/designers/' . $designer->id . '/' . $fileName, file_get_contents($request->designer_identity), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $designer->id . '/' . $fileName), 'description' => 'Designer Identity']);
            }
            if ($request->has('commerical_registeration')) {
                $fileName = Str::random(6) . '-' . $request->commerical_registeration->getClientOriginalName();
                $commerical_registeration_image = Storage::put('public/designers/' . $designer->id . '/' . $fileName, file_get_contents($request->commerical_registeration), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $designer->id . '/' . $fileName), 'description' => 'Commerical Registeration']);
            }

            if ($request->has('tax_id')) {
                $fileName = Str::random(6) . '-' . $request->tax_id->getClientOriginalName();
                $tax_id_image = Storage::put('public/designers/' . $designer->id . '/' . $fileName, file_get_contents($request->tax_id), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $designer->id . '/' . $fileName), 'description' => 'Tax Indentity']);
            }

            $langs = getLanguages();
            foreach ($langs as $lang) {
                $designer
                    ->translateOrNew($lang->locale)->company_name = $designer_data['company_name'][$lang->locale] ?? '';
                $designer
                    ->translateOrNew($lang->locale)->job_title = $designer_data['job_title'][$lang->locale] ?? null;
                $designer
                    ->translateOrNew($lang->locale)->bio = $designer_data['bio'][$lang->locale] ?? null;
                $designer
                    ->translateOrNew($lang->locale)->address = $designer_data['address'][$lang->locale] ?? null;
            }

            $designer->save();
        } catch (\Illuminate\Database\QueryException $exception) {
            return response()->json([
                'code' => 500,
                'status' => 'error',
                'message' => $exception->errorInfo,
            ], 500);
        }

//        Mail::to($request->validated()['email'])->send(new UserCreatedUserMail($user));

        return new DesignerUser($user);
    }

    public function update(Update $request, $id)
    {
        $user = User::findOrFail($id);
        $user_data = collect($request->validated())->only(collect((new UpdateRegular)->rules())->keys())->toArray();
        $user->update($user_data);
        $id = $user->id;
        $designer_data = collect($request->validated())->except(collect((new UpdateRegular)->rules())->keys())->toArray();
        $designer = $user->designer;
        if ($request->has('avatar')) {
            $image = $request->file('avatar');
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
            $designer_data['avatar'] = Storage::url('public/users/' . $fileName);
        }

        if ($request->has('cover_photo')) {
            $image = $request->file('cover_photo');
            $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
            $image = Storage::put('public/users/' . $fileName, file_get_contents($image), 'public');
            $designer_data['cover_photo'] = Storage::url('public/users/' . $fileName);
        }

        if ($request->has('designer_identity')) {
            foreach ($request->file('designer_identity') as $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/designers/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $id . '/' . $fileName), 'description' => 'Designer Identity']);
            }
        }

        if ($request->has('commerical_registeration')) {
            foreach ($request->file('commerical_registeration') as $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/designers/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $id . '/' . $fileName), 'description' => 'Commerical Registeration']);
            }
        }

        if ($request->has('tax_id')) {
            foreach ($request->file('tax_id') as $image) {
                $fileName = Str::random(6) . '-' . $image->getClientOriginalName();
                $image = Storage::put('public/designers/' . $id . '/' . $fileName, file_get_contents($image), 'public');
                $designer->images()->create(['url' => Storage::url('public/designers/' . $id . '/' . $fileName), 'description' => 'Tax Indentity']);
            }
        }

        $designer->update(collect($designer_data)->except(['categories', 'designer_identity', 'commerical_registeration', 'tax_id', 'company_name', 'job_title', 'bio', 'address'])->toArray());

        if ($request->filled('categories')) {
            $designer->categories()->sync($request->categories);
        }

        foreach ($designer_data['company_name'] ?? [] as $lang => $name) {
            $designer->translateOrNew($lang)->company_name = $name;
        }
        foreach ($designer_data['job_title'] ?? [] as $lang => $name) {
            $designer->translateOrNew($lang)->job_title = $name;
        }

        foreach ($designer_data['bio'] ?? [] as $lang => $name) {
            $designer->translateOrNew($lang)->bio = $name;
        }

        foreach ($designer_data['address'] ?? [] as $lang => $name) {
            $designer->translateOrNew($lang)->address = $name;
        }

        $designer->save();
        return new DesignerUser($user);
    }


    public function changeStatus(User $user, Request $request)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(DesignerStatusType::Pending, DesignerStatusType::Active, DesignerStatusType::Suspend, DesignerStatusType::Draft)],
        ]);

        $user->designer()->update(
            ['status' => $request->status]
        );

        return response()->json([
            'code' => 200,
            'status' => __('success'),
            'message' => __('status change success'),
            'errors' => '',
        ], 200);
    }

    public function filterData()
    {
        return response()->json([
            'data' => [
                'max_exp' => Designer::max('experience')
            ]
        ]);
    }
}
