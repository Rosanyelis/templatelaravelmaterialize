<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PosController;
use App\Http\Controllers\RolController;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\KardexController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\WorkOrderController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    # Roles
    Route::get('/roles', [RolController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RolController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RolController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RolController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RolController::class, 'update'])->name('roles.update');
    Route::get('/roles/{role}', [RolController::class, 'destroy'])->name('roles.destroy');

    # Usuarios
    Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
    Route::get('/usuarios/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/usuarios/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/usuarios/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/usuarios/{user}/update', [UserController::class, 'update'])->name('users.update');
    Route::get('/usuarios/{user}/destroy', [UserController::class, 'destroy'])->name('users.destroy');

    
});
Route::get('comandos', function () {
 Artisan::call('optimize');
 Artisan::call('view:clear');
 Artisan::call('cache:clear');
 Artisan::call('route:clear');
 Artisan::call('config:clear');
 Artisan::call('config:cache');
 Artisan::call('view:cache');
 Artisan::call('route:cache');

 return 'Comandos ejecutados con éxitos';
});

require __DIR__.'/auth.php';
