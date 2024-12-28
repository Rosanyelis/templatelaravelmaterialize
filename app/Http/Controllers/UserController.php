<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUser;
use Yajra\DataTables\DataTables;
use App\Http\Requests\UpdateUser;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $data = DB::table('users')
                    ->join('rols', 'users.rol_id', '=', 'rols.id')
                    ->where('rols.name', '!=', 'Desarrollador')
                    ->select('users.*', 'rols.name as rol');
            return DataTables::of($data)
                ->addColumn('actions', function ($data) {
                    return view('users.partials.actions', ['id' => $data->id]);
                })
                ->rawColumns(['actions'])
                ->make(true);
        }

        return view('users.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Rol::where('name', '!=', 'Desarrollador')->get();
        return view('users.create', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUser $request)
    {
        $data = $request->all();
        $data['password'] = bcrypt($request->password);
        User::create($data);
        return redirect()->route('users.index')->with('success', 'Usuario creado con exito');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        $roles = Rol::where('name', '!=', 'Desarrollador')->get();
        return view('users.edit', compact('user', 'roles'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUser $request, string $id)
    {
        $user = User::find($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->rol_id = $request->rol_id;
        if($request->password){
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return redirect()->route('users.index')->with('success', 'Usuario actualizado con exito');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::find($id)->delete();
        return redirect()->route('users.index')->with('success', 'Usuario eliminado con exito');
    }
}
