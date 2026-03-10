<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('educonnect:bootstrap-superadmin', function () {
    $name = (string) env('EDUCONNECT_SUPERADMIN_NAME', 'Super Admin');
    $email = (string) env('EDUCONNECT_SUPERADMIN_EMAIL', '');
    $password = (string) env('EDUCONNECT_SUPERADMIN_PASSWORD', '');

    if ($email === '' || $password === '') {
        $this->error('Missing EDUCONNECT_SUPERADMIN_EMAIL or EDUCONNECT_SUPERADMIN_PASSWORD in .env');
        return 1;
    }

    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $this->error('EDUCONNECT_SUPERADMIN_EMAIL is not a valid email address.');
        return 1;
    }

    /** @var \App\Models\User|null $user */
    $user = \App\Models\User::query()->where('email', $email)->first();

    if (! $user) {
        $user = \App\Models\User::create([
            'name' => $name,
            'email' => Str::lower($email),
            'password' => Hash::make($password),
            'role' => 'superadmin',
            'email_verified_at' => now(),
        ]);

        $this->info("Created superadmin: {$user->email}");
        return 0;
    }

    $user->name = $name;
    $user->email = Str::lower($email);
    $user->role = 'superadmin';
    $user->email_verified_at = $user->email_verified_at ?: now();
    $user->password = Hash::make($password);
    $user->save();

    $this->info("Updated superadmin: {$user->email}");
    return 0;
})->purpose('Create or update the initial superadmin account from .env');
