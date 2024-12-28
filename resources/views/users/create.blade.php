@extends('layouts.app')
@section('title', 'Usuarios - Crear')
@section('content')
    <div class="container-xxl flex-grow-1 container-p-y">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Nuevo Usuario</h5>

                        <a href="{{ route('users.index') }}" class="btn btn-sm btn-secondary"
                        ><i class="ri-arrow-left-line me-1"></i> Regresar</a>
                    </div>
                    <!-- <h5 class="card-header">Crear Categoría</h5> -->

                    <div class="card-body">
                        <form id="formCategory" class="needs-validation" action="{{ route('users.store') }}" method="POST">
                            @csrf
                            <div class="row">
                                <div class="mb-6 col-md-4">
                                    <div class="form-floating form-floating-outline">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            class="form-control @if($errors->has('name')) is-invalid @endif"
                                            placeholder="Ingrese nombre de usuario"
                                            value="{{ old('name') }}"
                                        />
                                        <label for="code">Usuario</label>
                                        @if($errors->has('name'))
                                        <div class="invalid-feedback">
                                            {{ $errors->first('name') }}
                                        </div>
                                        @endif
                                    </div>
                                </div>
                                <div class="mb-6 col-md-4">
                                    <div class="form-floating form-floating-outline">
                                        <select id="rol_id" name="rol_id" class="form-select select2"
                                            placeholder="Selecione un Rol">
                                            <option value="">-- Seleccionar --</option>
                                            @foreach($roles as $rol)
                                            <option value="{{ $rol->id }}" {{ old('rol_id') == $rol->id ? selected : '' }} >{{ $rol->name }}</option>
                                            @endforeach
                                        </select>
                                        <label for="rol_id">Rol</label>
                                        @if($errors->has('rol_id'))
                                        <div class="invalid-feedback">
                                            {{ $errors->first('rol_id') }}
                                        </div>
                                        @endif
                                    </div>
                                </div>
                                <div class="mb-6 col-md-4">
                                    <div class="form-floating form-floating-outline">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            class="form-control @if($errors->has('email')) is-invalid @endif"
                                            placeholder="Ingrese Correo"
                                            value="{{ old('email') }}"
                                        />
                                        <label for="code">Correo</label>
                                        @if($errors->has('email'))
                                        <div class="invalid-feedback">
                                            {{ $errors->first('email') }}
                                        </div>
                                        @endif
                                    </div>
                                </div>
                                <div class="mb-6 col-md-4">
                                    <div class="form-floating form-floating-outline">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            class="form-control @if($errors->has('password')) is-invalid @endif"
                                            placeholder="********"
                                            value="{{ old('password') }}"
                                        />
                                        <label for="code">Contraseña</label>
                                        @if($errors->has('password'))
                                        <div class="invalid-feedback">
                                            {{ $errors->first('password') }}
                                        </div>
                                        @endif
                                    </div>
                                </div>

                            </div>
                            <div class="row justify-content-end">
                                <div class="mb-3 col-md-1">
                                    <button type="submit" class="btn btn-primary float-end">
                                        <i class="ri-save-2-line me-1"></i>
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
