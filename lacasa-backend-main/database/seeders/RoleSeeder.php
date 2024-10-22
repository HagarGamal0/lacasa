<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('roles')->truncate();
        $role = Role::create(['name' => 'Super Admin']);
        $role = Permission::create(['name' => 'View Products']);
        $role = Permission::create(['name' => 'Edit Products']);
        $role = Permission::create(['name' => 'View Orders']);
        $role = Permission::create(['name' => 'Edit Orders']);
        $role = Permission::create(['name' => 'View Users']);
        $role = Permission::create(['name' => 'Edit Users']);
        $role = Permission::create(['name' => 'View Vendors']);
        $role = Permission::create(['name' => 'Edit Vendors']);
        $role = Permission::create(['name' => 'View Settings']);
        $role = Permission::create(['name' => 'Edit Settings']);
    }
}
