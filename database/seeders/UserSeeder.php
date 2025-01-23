<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dev = User::create([
            'name' => 'Desarrollador',
            'email' => 'administrador@example.com',
            'password' => Hash::make('admin'), // password
        ]);
        $dev->assignRole('Desarrollador');

        $dato = User::create([
            'name' => 'Simbio',
            'email' => 'simbio@example.com',
            'password' => Hash::make('admin'), // password
        ]);
        $dato->assignRole('Administrador');
    }
}
