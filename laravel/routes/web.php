<?php

use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\User;
use App\Support\RoleDashboard;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

Route::get('/', function () {
    $categoryCounts = [];
    if (Schema::hasTable('categories') && Schema::hasTable('category_user')) {
        $categoryCounts = Category::query()
            ->withCount([
                'users as tutors_count' => function ($query) {
                    $query->where('role', 'teacher');
                },
            ])
            ->pluck('tutors_count', 'slug')
            ->all();
    }

    $teacherCount = Schema::hasTable('users')
        ? User::query()->where('role', 'teacher')->count()
        : 0;

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categoryCounts' => $categoryCounts,
        'teacherCount' => $teacherCount,
    ]);
});

Route::get('/tutors', function (Request $request) {
    return Inertia::render('Public/Tutors', [
        'filters' => [
            'subject' => $request->string('subject')->trim()->value(),
            'level' => $request->string('level')->trim()->value() ?: 'jss',
            'mode' => $request->string('mode')->trim()->value() ?: 'online',
            'city' => $request->string('city')->trim()->value() ?: 'any',
        ],
    ]);
})->name('tutors.index');

Route::get('/reviews', function () {
    return Inertia::render('Public/Reviews');
})->name('reviews.index');

Route::get('/dashboard', function () {
    $user = auth()->user();
    return redirect(RoleDashboard::path($user ? $user->role : null));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/parent', function () {
        return Inertia::render('Dashboards/Parent');
    })->middleware('role:parent')->name('dashboard.parent');

    Route::get('/dashboard/teacher', function () {
        return Inertia::render('Dashboards/Teacher');
    })->middleware('role:teacher')->name('dashboard.teacher');

    Route::get('/dashboard/admin', function () {
        return Inertia::render('Dashboards/Admin');
    })->middleware('role:admin,superadmin')->name('dashboard.admin');

    Route::get('/dashboard/superadmin', function () {
        return Inertia::render('Dashboards/Superadmin');
    })->middleware('role:superadmin')->name('dashboard.superadmin');

    Route::get('/dashboard/superadmin/teachers', [UsersController::class, 'teachers'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.teachers');

    Route::prefix('admin')->name('admin.')->middleware('role:superadmin')->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name('users');
        Route::patch('/users/{user}/role', [UsersController::class, 'updateRole'])->name('users.role');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
