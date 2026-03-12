<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
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

Artisan::command('educonnect:lessons-tick', function () {
    if (! Schema::hasTable('schedules')) {
        $this->info('No schedules table.');
        return 0;
    }
    if (! Schema::hasTable('wallet_transactions') || ! Schema::hasColumn('users', 'wallet_balance_kobo')) {
        $this->info('Wallet tables/columns missing.');
        return 0;
    }

    $now = now();

    $endedCount = 0;
    $ended = \App\Models\Schedule::query()
        ->where('lesson_status', 'scheduled')
        ->whereNotNull('scheduled_start')
        ->orderBy('scheduled_start')
        ->take(500)
        ->get();

    foreach ($ended as $s) {
        $start = $s->scheduled_start;
        if (! $start) {
            continue;
        }
        $end = $start->copy()->addMinutes((int) ($s->duration_minutes ?? 60));
        if ($end > $now) {
            continue;
        }
        $s->update([
            'status' => 'completed',
            'lesson_status' => 'awaiting_confirmation',
            'auto_confirm_at' => $now->copy()->addHours(24),
        ]);
        $endedCount++;

        if ($s->parent_id) {
            \App\Models\SimpleNotification::create([
                'user_id' => $s->parent_id,
                'type' => 'lesson_awaiting_confirmation',
                'data' => ['schedule_id' => $s->id],
            ]);
        }
        \App\Models\SimpleNotification::create([
            'user_id' => $s->teacher_id,
            'type' => 'lesson_awaiting_confirmation',
            'data' => ['schedule_id' => $s->id],
        ]);
    }

    $autoConfirmed = 0;
    $auto = \App\Models\Schedule::query()
        ->where('lesson_status', 'awaiting_confirmation')
        ->whereNotNull('auto_confirm_at')
        ->where('auto_confirm_at', '<=', $now)
        ->orderBy('auto_confirm_at')
        ->take(300)
        ->get();

    foreach ($auto as $schedule) {
        DB::transaction(function () use ($schedule, &$autoConfirmed) {
            $schedule->refresh();
            if ((string) $schedule->lesson_status !== 'awaiting_confirmation') {
                return;
            }

            $rateKobo = (int) ($schedule->tutor_rate_kobo ?? 0);
            $commissionBps = (int) ($schedule->commission_bps ?? 1000);
            $feeKobo = (int) floor($rateKobo * $commissionBps / 10000);
            $netKobo = max(0, $rateKobo - $feeKobo);

            $parentId = (int) ($schedule->parent_id ?? 0);
            if ($parentId <= 0) {
                $schedule->update([
                    'lesson_status' => 'issue_reported',
                    'issue_note' => 'Missing parent_id for auto-confirm.',
                ]);
                return;
            }

            $parent = \App\Models\User::query()->lockForUpdate()->find($parentId);
            $tutor = \App\Models\User::query()->lockForUpdate()->find((int) $schedule->teacher_id);
            if (! $parent || ! $tutor) {
                return;
            }

            if ((int) $parent->wallet_balance_kobo < $rateKobo) {
                $schedule->update([
                    'lesson_status' => 'issue_reported',
                    'issue_note' => 'Insufficient wallet balance at auto-confirm.',
                ]);
                \App\Models\SimpleNotification::create([
                    'user_id' => $parent->id,
                    'type' => 'lesson_issue',
                    'data' => ['schedule_id' => $schedule->id],
                ]);
                return;
            }

            $parent->decrement('wallet_balance_kobo', $rateKobo);
            $tutor->increment('balance_cents', $netKobo);

            \App\Models\WalletTransaction::create([
                'user_id' => $parent->id,
                'wallet_type' => 'parent',
                'amount_kobo' => -$rateKobo,
                'type' => 'lesson_confirmation',
                'reference' => $schedule->booking_intent_id ? "booking_intent:{$schedule->booking_intent_id}" : null,
                'meta' => ['schedule_id' => $schedule->id, 'tutor_id' => $tutor->id, 'auto' => true],
            ]);

            \App\Models\WalletTransaction::create([
                'user_id' => $tutor->id,
                'wallet_type' => 'tutor',
                'amount_kobo' => $netKobo,
                'type' => 'lesson_confirmation',
                'reference' => $schedule->booking_intent_id ? "booking_intent:{$schedule->booking_intent_id}" : null,
                'meta' => ['schedule_id' => $schedule->id, 'parent_id' => $parent->id, 'fee_kobo' => $feeKobo, 'auto' => true],
            ]);

            if (Schema::hasTable('transactions')) {
                \App\Models\Transaction::create([
                    'agreement_id' => null,
                    'payer_id' => $parent->id,
                    'tutor_id' => $tutor->id,
                    'amount_cents' => $rateKobo,
                    'fee_cents' => $feeKobo,
                    'net_cents' => $netKobo,
                    'status' => 'cleared',
                    'description' => 'Lesson auto-confirmed',
                ]);
            }

            $schedule->update([
                'lesson_status' => 'confirmed',
                'confirmed_at' => now(),
                'auto_confirm_at' => null,
            ]);

            \App\Models\SimpleNotification::create([
                'user_id' => $parent->id,
                'type' => 'lesson_confirmed',
                'data' => ['schedule_id' => $schedule->id, 'auto' => true],
            ]);
            \App\Models\SimpleNotification::create([
                'user_id' => $tutor->id,
                'type' => 'lesson_confirmed',
                'data' => ['schedule_id' => $schedule->id, 'auto' => true],
            ]);

            $autoConfirmed++;
        });
    }

    $reminded24 = 0;
    $reminded1 = 0;

    $hasReminderCols = Schema::hasColumn('schedules', 'reminder_24h_sent_at') && Schema::hasColumn('schedules', 'reminder_1h_sent_at');

    $upcoming = $hasReminderCols
        ? \App\Models\Schedule::query()
            ->where('lesson_status', 'scheduled')
            ->whereNotNull('scheduled_start')
            ->orderBy('scheduled_start')
            ->take(800)
            ->get()
        : collect();

    foreach ($upcoming as $s) {
        $start = $s->scheduled_start;
        if (! $start) {
            continue;
        }
        $mins = $now->diffInMinutes($start, false);
        if ($mins <= 0) {
            continue;
        }

        if ($mins <= 60 && $mins >= 55 && ! $s->reminder_1h_sent_at) {
            $s->update(['reminder_1h_sent_at' => $now]);
            $reminded1++;

            if ($s->parent_id) {
                \App\Models\SimpleNotification::create([
                    'user_id' => $s->parent_id,
                    'type' => 'lesson_reminder_1h',
                    'data' => ['schedule_id' => $s->id],
                ]);
            }
            \App\Models\SimpleNotification::create([
                'user_id' => $s->teacher_id,
                'type' => 'lesson_reminder_1h',
                'data' => ['schedule_id' => $s->id],
            ]);

            try {
                $parent = $s->parent_id ? \App\Models\User::query()->find($s->parent_id) : null;
                $tutor = \App\Models\User::query()->find($s->teacher_id);
                $subject = 'Lesson reminder (1 hour)';
                $body = "Your lesson starts in about 1 hour.\nSchedule ID: {$s->id}\n";
                if ($parent && $parent->email) {
                    Mail::raw($body, fn ($m) => $m->to($parent->email)->subject($subject));
                }
                if ($tutor && $tutor->email) {
                    Mail::raw($body, fn ($m) => $m->to($tutor->email)->subject($subject));
                }
            } catch (\Throwable $e) {
            }
        }

        if ($mins <= 1440 && $mins >= 1435 && ! $s->reminder_24h_sent_at) {
            $s->update(['reminder_24h_sent_at' => $now]);
            $reminded24++;

            if ($s->parent_id) {
                \App\Models\SimpleNotification::create([
                    'user_id' => $s->parent_id,
                    'type' => 'lesson_reminder_24h',
                    'data' => ['schedule_id' => $s->id],
                ]);
            }
            \App\Models\SimpleNotification::create([
                'user_id' => $s->teacher_id,
                'type' => 'lesson_reminder_24h',
                'data' => ['schedule_id' => $s->id],
            ]);

            try {
                $parent = $s->parent_id ? \App\Models\User::query()->find($s->parent_id) : null;
                $tutor = \App\Models\User::query()->find($s->teacher_id);
                $subject = 'Lesson reminder (24 hours)';
                $body = "Your lesson starts in about 24 hours.\nSchedule ID: {$s->id}\n";
                if ($parent && $parent->email) {
                    Mail::raw($body, fn ($m) => $m->to($parent->email)->subject($subject));
                }
                if ($tutor && $tutor->email) {
                    Mail::raw($body, fn ($m) => $m->to($tutor->email)->subject($subject));
                }
            } catch (\Throwable $e) {
            }
        }
    }

    $this->info("Updated ended lessons: {$endedCount}");
    $this->info("Auto-confirmed lessons: {$autoConfirmed}");
    $this->info("Sent 24h reminders: {$reminded24}");
    $this->info("Sent 1h reminders: {$reminded1}");
    return 0;
})->purpose('Move ended lessons to awaiting confirmation and auto-confirm after 24 hours');

Artisan::command('educonnect:tutor-discontinue {tutorId} {--reason=}', function () {
    $tutorId = (int) $this->argument('tutorId');
    $reason = (string) ($this->option('reason') ?: 'Tutor is no longer available.');

    if ($tutorId <= 0) {
        $this->error('Invalid tutorId');
        return 1;
    }

    if (! Schema::hasTable('users') || ! Schema::hasTable('schedules')) {
        $this->error('Missing users or schedules table.');
        return 1;
    }

    $tutor = \App\Models\User::query()->find($tutorId);
    if (! $tutor || (string) $tutor->role !== 'teacher') {
        $this->error('Tutor not found.');
        return 1;
    }

    if (Schema::hasColumn('users', 'disabled_at')) {
        $tutor->disabled_at = now();
        $tutor->save();
    }

    $now = now();
    $affected = 0;
    $parentIds = [];

    $future = \App\Models\Schedule::query()
        ->where('teacher_id', $tutor->id)
        ->whereIn('lesson_status', ['scheduled', 'awaiting_confirmation'])
        ->whereNotNull('scheduled_start')
        ->where('scheduled_start', '>', $now)
        ->orderBy('scheduled_start')
        ->take(2000)
        ->get();

    foreach ($future as $s) {
        if ($s->parent_id) {
            $parentIds[] = (int) $s->parent_id;
        } else {
            try {
                $attendeeIds = $s->attendees()->pluck('users.id')->all();
                $parentIds = array_merge($parentIds, array_map('intval', $attendeeIds));
            } catch (\Throwable $e) {
            }
        }

        $s->update([
            'status' => 'cancelled',
            'lesson_status' => 'cancelled',
            'issue_note' => $reason,
        ]);
        $affected++;
    }

    $parentIds = array_values(array_unique(array_filter($parentIds, fn ($id) => $id > 0 && $id !== $tutor->id)));

    foreach ($parentIds as $pid) {
        \App\Models\SimpleNotification::create([
            'user_id' => $pid,
            'type' => 'tutor_unavailable',
            'data' => ['tutor_id' => $tutor->id, 'tutor_name' => $tutor->name, 'reason' => $reason],
        ]);

        $parent = \App\Models\User::query()->find($pid);
        if ($parent && $parent->email && config('mail.default')) {
            try {
                $body = "Your tutor is no longer available.\nTutor: {$tutor->name}\nReason: {$reason}\nYour credits are safe. Please choose a new tutor.\n";
                Mail::raw($body, fn ($m) => $m->to($parent->email)->subject('Tutor no longer available'));
            } catch (\Throwable $e) {
            }
        }
    }

    $this->info("Tutor discontinued: {$tutor->id} ({$tutor->email})");
    $this->info("Cancelled future lessons: {$affected}");
    $this->info('Notified parents: ' . count($parentIds));
    return 0;
})->purpose('Disable a tutor and cancel future lessons, notifying affected parents');
