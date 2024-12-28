<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rol::create(['name' => 'Desarrollador']);
        Rol::create(['name' => 'Administrador']);
        Rol::create(['name' => 'Tecnico']);
        Rol::create(['name' => 'Cajero']);
    }
}
