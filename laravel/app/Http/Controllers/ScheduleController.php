<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    private function effectiveRole(Request $request): string
    {
        $user = $request->user();
        $role = $user ? (string) $user->role : '';
        if ($role === 'superadmin') {
            $impersonate = (string) $request->session()->get('impersonate_role', '');
            if (in_array($impersonate, ['parent', 'teacher'], true)) {
                $role = $impersonate;
            }
        }
        return $role;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $role = $this->effectiveRole($request);

        $schedules = [];
        if (Schema::hasTable('schedules')) {
            if ($role === 'teacher') {
                $schedules = Schedule::query()
                    ->where('teacher_id', $user->id)
                    ->with('attendees:id,name,email')
                    ->orderByDesc('scheduled_start')
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $schedules = $user->belongsToMany(Schedule::class, 'schedule_user')
                    ->with('teacher:id,name')
                    ->orderByDesc('scheduled_start')
                    ->orderByDesc('created_at')
                    ->get();
            }
        }

        return Inertia::render('Dashboards/Schedules', [
            'role' => $role,
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:1000'],
            'day_of_week' => ['nullable', 'string', 'max:16'],
            'start_time' => ['nullable'],
            'recurring' => ['boolean'],
            'date' => ['nullable', 'date'],
            'invite_email' => ['nullable', 'email'],
        ]);

        $schedule = Schedule::create([
            'teacher_id' => $user->id,
            'title' => $data['title'],
            'link' => $data['link'] ?? null,
            'day_of_week' => $data['day_of_week'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'recurring' => (bool) ($data['recurring'] ?? false),
            'date' => $data['date'] ?? null,
        ]);

        if (!empty($data['invite_email'])) {
            $invitee = User::query()->where('email', $data['invite_email'])->first();
            if ($invitee) {
                $schedule->attendees()->syncWithoutDetaching([$invitee->id]);
                SimpleNotification::create([
                    'user_id' => $invitee->id,
                    'type' => 'schedule_invite',
                    'data' => ['title' => $schedule->title, 'from' => $user->name],
                ]);
            }
        }

        return back()->with('status', 'Schedule created');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:1000'],
            'day_of_week' => ['nullable', 'string', 'max:16'],
            'start_time' => ['nullable'],
            'recurring' => ['boolean'],
            'date' => ['nullable', 'date'],
        ]);

        $schedule->update($data);

        return back()->with('status', 'Schedule updated');
    }

    public function destroy(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);
        $schedule->delete();
        return back()->with('status', 'Schedule deleted');
    }

    public function complete(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);
        $schedule->update(['status' => 'completed']);
        return back()->with('status', 'Marked completed');
    }

    public function parentConfirm(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'parent', 403);
        abort_unless($schedule->attendees()->where('users.id', $user->id)->exists(), 403);

        $schedule->refresh();
        abort_unless((string) $schedule->lesson_status === 'awaiting_confirmation', 422);

        abort_unless(Schema::hasColumn('users', 'wallet_balance_kobo'), 503);
        abort_unless(Schema::hasTable('wallet_transactions'), 503);

        DB::transaction(function () use ($schedule, $user) {
            $schedule->refresh();
            if ((string) $schedule->lesson_status !== 'awaiting_confirmation') {
                return;
            }

            $rateKobo = (int) ($schedule->tutor_rate_kobo ?? 0);
            $commissionBps = (int) ($schedule->commission_bps ?? 1000);
            $feeKobo = (int) floor($rateKobo * $commissionBps / 10000);
            $netKobo = max(0, $rateKobo - $feeKobo);

            $parent = User::query()->lockForUpdate()->find($user->id);
            $tutor = User::query()->lockForUpdate()->find($schedule->teacher_id);
            if (! $parent || ! $tutor) {
                return;
            }

            if ((int) $parent->wallet_balance_kobo < $rateKobo) {
                $schedule->update([
                    'lesson_status' => 'issue_reported',
                    'issue_note' => 'Insufficient wallet balance at confirmation.',
                ]);
                SimpleNotification::create([
                    'user_id' => $parent->id,
                    'type' => 'lesson_issue',
                    'data' => ['schedule_id' => $schedule->id],
                ]);
                return;
            }

            $parent->decrement('wallet_balance_kobo', $rateKobo);
            $tutor->increment('balance_cents', $netKobo);

            WalletTransaction::create([
                'user_id' => $parent->id,
                'wallet_type' => 'parent',
                'amount_kobo' => -$rateKobo,
                'type' => 'lesson_confirmation',
                'reference' => $schedule->booking_intent_id ? "booking_intent:{$schedule->booking_intent_id}" : null,
                'meta' => ['schedule_id' => $schedule->id, 'tutor_id' => $tutor->id],
            ]);

            WalletTransaction::create([
                'user_id' => $tutor->id,
                'wallet_type' => 'tutor',
                'amount_kobo' => $netKobo,
                'type' => 'lesson_confirmation',
                'reference' => $schedule->booking_intent_id ? "booking_intent:{$schedule->booking_intent_id}" : null,
                'meta' => ['schedule_id' => $schedule->id, 'parent_id' => $parent->id, 'fee_kobo' => $feeKobo],
            ]);

            if (Schema::hasTable('transactions')) {
                Transaction::create([
                    'agreement_id' => null,
                    'payer_id' => $parent->id,
                    'tutor_id' => $tutor->id,
                    'amount_cents' => $rateKobo,
                    'fee_cents' => $feeKobo,
                    'net_cents' => $netKobo,
                    'status' => 'cleared',
                    'description' => 'Lesson confirmed',
                ]);
            }

            $schedule->update([
                'lesson_status' => 'confirmed',
                'confirmed_at' => now(),
                'auto_confirm_at' => null,
            ]);

            SimpleNotification::create([
                'user_id' => $parent->id,
                'type' => 'lesson_confirmed',
                'data' => ['schedule_id' => $schedule->id],
            ]);
            SimpleNotification::create([
                'user_id' => $tutor->id,
                'type' => 'lesson_confirmed',
                'data' => ['schedule_id' => $schedule->id],
            ]);
        });

        return back()->with('status', 'Lesson confirmed.');
    }

    public function parentIssue(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'parent', 403);
        abort_unless($schedule->attendees()->where('users.id', $user->id)->exists(), 403);

        $data = $request->validate([
            'issue_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $schedule->update([
            'lesson_status' => 'issue_reported',
            'issue_note' => $data['issue_note'] ?? null,
        ]);

        SimpleNotification::create([
            'user_id' => $schedule->teacher_id,
            'type' => 'lesson_issue',
            'data' => ['schedule_id' => $schedule->id],
        ]);

        return back()->with('status', 'Issue reported.');
    }
}
