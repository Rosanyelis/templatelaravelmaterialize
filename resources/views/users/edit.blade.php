@extends('layouts.app')

@section('title') Usuarios  @endsection

@section('css')

@endsection

@section('content')

<!-- start page title -->
<div class="row">
    <div class="col-12">
        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Usuarios </h4>

            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="{{ route('categorias.index') }}">Usuarios</a>
                    </li>
                    <li class="breadcrumb-item active">Editar Usuario</li>
                </ol>
            </div>

        </div>
    </div>
</div>
<!-- end page title -->
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Editar Usuario</h4>
            </div>
            <div class="card-body p-4">
                <form action="{{ route('users.update', $user->id) }}" method="POST"
                    enctype="multipart/form-data" class="needs-validation @if ($errors->any()) was-validated @endif"
                    novalidate>
                    @csrf
                    @method('PUT')
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre de Usuario</label>
                                <input class="form-control" type="text" name="name" id="code" required
                                    value="{{ $user->name }}">
                                @if($errors->has('name'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('name') }}
                                    </div>
                                @endif
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="mb-3">
                                <label for="name" class="form-label">Rol de Usuario</label>
                                <select name="rol_id" class="form-select">
                                    <option value="">Seleccionar</option>
                                    @foreach($roles as $role)
                                        <option value="{{ $role->id }}" @if($user->rol_id == $role->id) selected @endif>{{ $role->name }}</option>
                                    @endforeach
                                </select>
                                @if($errors->has('rol_id'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('rol_id') }}
                                    </div>
                                @endif
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="mb-3">
                                <label for="email" class="form-label">Correo Electrónico</label>
                                <input class="form-control" type="text" name="email" id="email" required
                                    value="{{ $user->email }}">
                                @if($errors->has('email'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('email') }}
                                    </div>
                                @endif
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input class="form-control" type="password" name="password" id="password" required
                                    value="{{ old('password') }}">
                                @if($errors->has('password'))
                                    <div class="invalid-feedback">
                                        {{ $errors->first('password') }}
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-md float-end">Actualizar Usuario</button>
                </form>
            </div>
        </div>
    </div>
</div>

@endSection

@section('scripts')
<script>

</script>
@endSection
