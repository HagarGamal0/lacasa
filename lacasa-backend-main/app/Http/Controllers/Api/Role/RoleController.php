<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\CreateRole;
use App\Http\Requests\Roles\UpdateRole;
use App\Http\Resources\Roles\Role as RoleResource;
use App\Models\User\User;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return RoleResource::collection(Role::with(['permissions', 'users'])->get());
    }

    public function show($id)
    {
        return new RoleResource(Role::with(['permissions', 'users'])->find($id));
    }

    public function store(CreateRole $request)
    {
        $request->validated();
        $role = Role::create(['name' => $request['name'], 'guard_name' => 'sanctum']);
        if ($request['permissions']) {
            $role->permissions()->syncWithoutDetaching($request['permissions']);
        }
        $role->fresh();
        if ($request['users']) {
            foreach ($request['users'] as $user) {
                User::find($user)->assignRole($role->id);
            }
        }

        return new RoleResource($role->load('permissions', 'users'));
    }

    public function update($id, UpdateRole $request)
    {
        $request->validated();
        // $role = Role::find($id)->update(['name' => $request->validated()['name'], 'guard_name' => 'sanctum']);
        $role = Role::find($id);
        if ($request['attach-permissions']) {
            $role->permissions()->syncWithoutDetaching($request['attach-permissions']);
        }
        if ($request['detach-permissions']) {
            $role->permissions()->detach($request['detach-permissions']);
        }
        $role->fresh();
        if ($request['attach-users']) {
            foreach ($request['attach-users'] as $user) {
                User::find($user)->assignRole($role->id);
            }
        }
        if ($request['detach-users']) {
            foreach ($request['detach-users'] as $user) {
                User::find($user)->removeRole($role->id);
            }
        }

        return new RoleResource($role->load('permissions', 'users'));
    }
}
