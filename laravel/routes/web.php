<?php

use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\AgreementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TutorProfileController;
use App\Http\Controllers\SuperadminVerificationController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\SuperadminPayoutController;
use App\Models\Category;
use App\Models\Schedule;
use App\Models\Agreement;
use App\Models\Transaction;
use App\Models\User;
use App\Support\RoleDashboard;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    $role = $user ? (string) $user->role : null;
    if ($role === 'superadmin') {
        $impersonate = (string) request()->session()->get('impersonate_role', '');
        if (in_array($impersonate, ['parent', 'teacher'], true)) {
            $role = $impersonate;
        }
    }
    return redirect(RoleDashboard::path($role));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/impersonate/role', function (Request $request) {
        $user = $request->user();
        if (! $user || (string) $user->role !== 'superadmin') {
            abort(403);
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:parent,teacher'],
        ]);

        $request->session()->put('impersonate_role', $validated['role']);

        return redirect()->route('dashboard');
    })->name('impersonate.role');

    Route::post('/impersonate/stop', function (Request $request) {
        $user = $request->user();
        if (! $user || (string) $user->role !== 'superadmin') {
            abort(403);
        }

        $request->session()->forget('impersonate_role');

        return redirect()->route('dashboard.superadmin');
    })->name('impersonate.stop');

    Route::get('/dashboard/parent', function () {
        $user = auth()->user();
        $upcomingSchedules = [];
        if ($user && Schema::hasTable('schedules') && Schema::hasTable('schedule_user')) {
            $upcomingSchedules = $user->belongsToMany(Schedule::class, 'schedule_user')
                ->where('status', 'scheduled')
                ->orderByDesc('created_at')
                ->take(5)
                ->get(['schedules.id', 'schedules.title', 'schedules.link', 'schedules.day_of_week', 'schedules.start_time', 'schedules.recurring', 'schedules.date', 'schedules.status']);
        }

        return Inertia::render('Dashboards/Parent', [
            'upcomingSchedules' => $upcomingSchedules,
        ]);
    })->middleware('role:parent')->name('dashboard.parent');

    Route::get('/dashboard/teacher', function () {
        $user = auth()->user();
        $upcomingSchedules = [];
        $activity = [];
        $nextStep = null;
        $pendingAgreements = 0;
        $balanceCents = 0;
        if ($user && Schema::hasTable('schedules')) {
            $upcomingSchedules = Schedule::query()
                ->where('teacher_id', $user->id)
                ->where('status', 'scheduled')
                ->orderByDesc('created_at')
                ->take(5)
                ->get(['id', 'title', 'link', 'day_of_week', 'start_time', 'recurring', 'date', 'status']);
        }

        if ($user && Schema::hasTable('agreements')) {
            $pendingAgreements = (int) Agreement::query()
                ->where('teacher_id', $user->id)
                ->where('status', 'pending_teacher')
                ->count();
        }

        if ($user && Schema::hasColumn('users', 'balance_cents')) {
            $balanceCents = (int) $user->balance_cents;
        }

        $messages7d = 0;
        if ($user && Schema::hasTable('messages')) {
            $messages7d = (int) DB::table('messages')
                ->where('to_user_id', $user->id)
                ->where('created_at', '>=', now()->subDays(7))
                ->count();
        }

        $schedules7d = 0;
        if ($user && Schema::hasTable('schedules')) {
            $schedules7d = (int) DB::table('schedules')
                ->where('teacher_id', $user->id)
                ->where('created_at', '>=', now()->subDays(7))
                ->count();
        }

        $activity = [
            'messages' => $messages7d,
            'schedules' => $schedules7d,
            'agreements_pending' => $pendingAgreements,
        ];

        $hasSubjects = false;
        if ($user && Schema::hasTable('categories') && Schema::hasTable('category_user')) {
            $hasSubjects = $user->categories()->exists();
        }

        $verificationStatus = 'not_started';
        if ($user && Schema::hasColumn('users', 'verification_status')) {
            $verificationStatus = (string) ($user->verification_status ?: 'not_started');
        }

        $hasSchedule = $user && Schema::hasTable('schedules')
            ? Schedule::query()->where('teacher_id', $user->id)->exists()
            : false;

        if (! $hasSubjects) {
            $nextStep = [
                'title' => 'Add what you teach',
                'detail' => 'Choose your subjects and set a rate so parents can book you.',
                'href' => route('profile.edit'),
                'action' => 'Update profile',
            ];
        } elseif (! in_array($verificationStatus, ['pending', 'approved'], true)) {
            $nextStep = [
                'title' => 'Submit verification',
                'detail' => 'Upload required documents to get approved and appear in search.',
                'href' => route('profile.edit'),
                'action' => 'Start verification',
            ];
        } elseif (! $hasSchedule) {
            $nextStep = [
                'title' => 'Create your first schedule',
                'detail' => 'Add a class link and time so booked parents can attend.',
                'href' => route('dashboard.schedules'),
                'action' => 'Create schedule',
            ];
        } elseif ($pendingAgreements > 0) {
            $nextStep = [
                'title' => 'Review agreements',
                'detail' => 'Accept pending agreements to unlock messaging and confirm payment terms.',
                'href' => route('dashboard.agreements'),
                'action' => 'Review now',
            ];
        }

        return Inertia::render('Dashboards/Teacher', [
            'upcomingSchedules' => $upcomingSchedules,
            'activity' => $activity,
            'nextStep' => $nextStep,
            'pendingAgreements' => $pendingAgreements,
            'balanceCents' => $balanceCents,
        ]);
    })->middleware('role:teacher')->name('dashboard.teacher');

    Route::get('/dashboard/admin', function () {
        return Inertia::render('Dashboards/Admin');
    })->middleware('role:admin,superadmin')->name('dashboard.admin');

    Route::get('/dashboard/superadmin', function () {
        return Inertia::render('Dashboards/Superadmin');
    })->middleware('role:superadmin')->name('dashboard.superadmin');

    Route::get('/dashboard/superadmin/verifications', [SuperadminVerificationController::class, 'index'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.verifications');
    Route::post('/dashboard/superadmin/verifications/{user}/approve', [SuperadminVerificationController::class, 'approve'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.verifications.approve');
    Route::post('/dashboard/superadmin/verifications/{user}/reject', [SuperadminVerificationController::class, 'reject'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.verifications.reject');

    Route::get('/dashboard/superadmin/payouts', [SuperadminPayoutController::class, 'index'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.payouts');
    Route::post('/dashboard/superadmin/payouts/{payoutRequest}/processing', [SuperadminPayoutController::class, 'setProcessing'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.payouts.processing');
    Route::post('/dashboard/superadmin/payouts/{payoutRequest}/paid', [SuperadminPayoutController::class, 'markPaid'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.payouts.paid');
    Route::post('/dashboard/superadmin/payouts/{payoutRequest}/reject', [SuperadminPayoutController::class, 'reject'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.payouts.reject');

    Route::get('/dashboard/superadmin/teachers', [UsersController::class, 'teachers'])
        ->middleware('role:superadmin')
        ->name('dashboard.superadmin.teachers');

    Route::prefix('admin')->name('admin.')->middleware('role:superadmin')->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name('users');
        Route::patch('/users/{user}/role', [UsersController::class, 'updateRole'])->name('users.role');
    });

    Route::get('/dashboard/messages', [MessageController::class, 'index'])->name('dashboard.messages');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');

    Route::get('/dashboard/notifications', [NotificationsController::class, 'index'])->name('dashboard.notifications');
    Route::post('/dashboard/notifications/read', [NotificationsController::class, 'markAllRead'])->name('dashboard.notifications.read');

    Route::get('/dashboard/schedules', [ScheduleController::class, 'index'])->name('dashboard.schedules');
    Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::patch('/schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');
    Route::post('/schedules/{schedule}/complete', [ScheduleController::class, 'complete'])->name('schedules.complete');

    // Booking + Agreements
    Route::post('/bookings/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/agreements/{agreement}/accept', [BookingController::class, 'tutorAccept'])->name('agreements.accept');

    // Payouts
    Route::get('/dashboard/payouts', [PayoutController::class, 'index'])->name('dashboard.payouts');
    Route::post('/payouts/request', [PayoutController::class, 'request'])->name('payouts.request');

    // Agreements
    Route::get('/dashboard/agreements', [AgreementController::class, 'index'])->name('dashboard.agreements');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/tutor', [TutorProfileController::class, 'updateTutorProfile'])->name('profile.tutor.update');
    Route::patch('/profile/availability', [TutorProfileController::class, 'updateAvailability'])->name('profile.availability.update');
    Route::post('/profile/verification/upload', [TutorProfileController::class, 'uploadVerification'])->name('profile.verification.upload');
    Route::post('/profile/verification/submit', [TutorProfileController::class, 'submitVerification'])->name('profile.verification.submit');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
