<?php

namespace App\Http\Controllers;

use App\Models\BookingIntent;
use App\Models\ManualPayment;
use App\Models\Schedule;
use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SuperadminPaymentController extends Controller
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
        abort_unless($user && (string) $user->role === 'superadmin', 403);

        $payments = [];
        if (Schema::hasTable('manual_payments')) {
            $payments = ManualPayment::query()
                ->with([
                    'parent:id,name,email',
                    'bookingIntent:id,reference,kind,amount_kobo,total_lessons,parent_id,tutor_id,created_at',
                    'bookingIntent.tutor:id,name',
                ])
                ->where('status', 'pending')
                ->orderByDesc('created_at')
                ->take(100)
                ->get()
                ->map(function (ManualPayment $p) {
                    return [
                        'id' => $p->id,
                        'amount_kobo' => (int) $p->amount_kobo,
                        'payment_reference' => $p->payment_reference,
                        'screenshot_path' => $p->screenshot_path,
                        'created_at' => $p->created_at ? $p->created_at->toDateTimeString() : null,
                        'parent' => $p->parent ? [
                            'id' => $p->parent->id,
                            'name' => $p->parent->name,
                            'email' => $p->parent->email,
                        ] : null,
                        'booking' => $p->bookingIntent ? [
                            'id' => $p->bookingIntent->id,
                            'reference' => $p->bookingIntent->reference,
                            'kind' => $p->bookingIntent->kind,
                            'amount_kobo' => (int) $p->bookingIntent->amount_kobo,
                            'total_lessons' => (int) $p->bookingIntent->total_lessons,
                            'tutor' => $p->bookingIntent->tutor ? [
                                'id' => $p->bookingIntent->tutor->id,
                                'name' => $p->bookingIntent->tutor->name,
                            ] : null,
                        ] : null,
                    ];
                })
                ->values();
        }

        return Inertia::render('Dashboards/SuperadminPayments', [
            'payments' => $payments,
        ]);
    }

    private function dayIndex(string $dayKey): int
    {
        return match (strtolower($dayKey)) {
            'monday' => 0,
            'tuesday' => 1,
            'wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6,
            default => 0,
        };
    }

    private function nextOccurrence(string $dayKey, string $time): Carbon
    {
        $now = now();
        $target = $now->copy()->setTimeFromTimeString($time)->startOfMinute();
        $targetDay = $this->dayIndex($dayKey);
        while ((int) $target->copy()->startOfDay()->diffInDays($now->copy()->startOfDay(), false) < -30) {
            break;
        }
        while ($this->dayIndex(strtolower($target->format('l'))) !== $targetDay || $target <= $now) {
            $target->addDay();
        }
        return $target;
    }

    private function enabledSlots(User $tutor): array
    {
        $availability = is_array($tutor->availability) ? $tutor->availability : [];
        $days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        $slots = [];
        foreach ($days as $d) {
            $row = $availability[$d] ?? null;
            if (! is_array($row) || empty($row['enabled'])) {
                continue;
            }
            $start = (string) ($row['start'] ?? '');
            if ($start === '') {
                continue;
            }
            $slots[] = ['day' => $d, 'time' => $start];
        }
        return $slots;
    }

    private function createLessonsForIntent(BookingIntent $intent): void
    {
        if (! Schema::hasTable('schedules') || ! Schema::hasTable('schedule_user')) {
            return;
        }
        if (! Schema::hasColumn('schedules', 'lesson_status') || ! Schema::hasColumn('schedules', 'scheduled_start')) {
            return;
        }

        $parent = User::query()->find($intent->parent_id);
        $tutor = User::query()->find($intent->tutor_id);
        if (! $parent || ! $tutor) {
            return;
        }

        $duration = (int) ($intent->duration_minutes ?? 60);
        $rate = (int) ($intent->tutor_rate_kobo ?? 0);
        $commissionBps = 1000;

        $created = [];

        if ((string) $intent->kind === 'trial') {
            $day = (string) ($intent->day_of_week ?? '');
            $time = (string) ($intent->start_time ?? '');
            if ($day === '' || $time === '') {
                return;
            }

            $start = $this->nextOccurrence($day, $time);
            $s = Schedule::create([
                'teacher_id' => $tutor->id,
                'parent_id' => $parent->id,
                'booking_intent_id' => $intent->id,
                'title' => "Lesson with {$tutor->name}",
                'link' => null,
                'day_of_week' => $day,
                'start_time' => $start->format('H:i'),
                'recurring' => false,
                'date' => $start->toDateString(),
                'scheduled_start' => $start,
                'duration_minutes' => $duration,
                'tutor_rate_kobo' => $rate,
                'commission_bps' => $commissionBps,
                'status' => 'scheduled',
                'lesson_status' => 'scheduled',
            ]);
            $s->attendees()->syncWithoutDetaching([$parent->id]);
            $created[] = $s;
        } else {
            $lessonsPerWeek = (int) ($intent->lessons_per_week ?? 0);
            $weeks = (int) ($intent->weeks ?? 4);
            if (! in_array($lessonsPerWeek, [1, 2, 3, 5], true) || $weeks < 1) {
                return;
            }

            $slots = $this->enabledSlots($tutor);
            if (count($slots) === 0) {
                return;
            }

            $weekStart = now()->startOfWeek(Carbon::MONDAY)->addWeek();
            for ($w = 0; $w < $weeks; $w++) {
                for ($i = 0; $i < $lessonsPerWeek; $i++) {
                    $slot = $slots[$i % count($slots)];
                    $date = $weekStart->copy()->addWeeks($w)->addDays($this->dayIndex($slot['day']));
                    $start = $date->copy()->setTimeFromTimeString($slot['time'])->startOfMinute();

                    $s = Schedule::create([
                        'teacher_id' => $tutor->id,
                        'parent_id' => $parent->id,
                        'booking_intent_id' => $intent->id,
                        'title' => "Lesson with {$tutor->name}",
                        'link' => null,
                        'day_of_week' => $slot['day'],
                        'start_time' => $start->format('H:i'),
                        'recurring' => false,
                        'date' => $start->toDateString(),
                        'scheduled_start' => $start,
                        'duration_minutes' => $duration,
                        'tutor_rate_kobo' => $rate,
                        'commission_bps' => $commissionBps,
                        'status' => 'scheduled',
                        'lesson_status' => 'scheduled',
                    ]);
                    $s->attendees()->syncWithoutDetaching([$parent->id]);
                    $created[] = $s;
                }
            }
        }

        if (count($created) > 0) {
            SimpleNotification::create([
                'user_id' => $parent->id,
                'type' => 'lessons_scheduled',
                'data' => ['count' => count($created)],
            ]);
            SimpleNotification::create([
                'user_id' => $tutor->id,
                'type' => 'lessons_scheduled',
                'data' => ['count' => count($created)],
            ]);
        }
    }

    public function approve(Request $request, ManualPayment $manualPayment)
    {
        $user = $request->user();
        abort_unless($user && (string) $user->role === 'superadmin', 403);
        abort_unless(Schema::hasColumn('users', 'wallet_balance_kobo'), 503);

        $parentEmail = null;
        $reference = null;
        $amountKobo = (int) $manualPayment->amount_kobo;

        DB::transaction(function () use ($manualPayment) {
            $manualPayment->refresh();
            if ((string) $manualPayment->status !== 'pending') {
                return;
            }

            $manualPayment->status = 'approved';
            $manualPayment->approved_at = now();
            $manualPayment->save();

            $intent = BookingIntent::query()->find($manualPayment->booking_intent_id);
            if ($intent) {
                $intent->status = 'approved';
                $intent->save();
            }

            $parent = User::query()->find($manualPayment->parent_id);
            if ($parent) {
                $parent->increment('wallet_balance_kobo', (int) $manualPayment->amount_kobo);
                WalletTransaction::create([
                    'user_id' => $parent->id,
                    'wallet_type' => 'parent',
                    'amount_kobo' => (int) $manualPayment->amount_kobo,
                    'type' => 'payment',
                    'reference' => $intent ? $intent->reference : null,
                    'meta' => [
                        'manual_payment_id' => $manualPayment->id,
                        'booking_intent_id' => $intent?->id,
                    ],
                ]);

                SimpleNotification::create([
                    'user_id' => $parent->id,
                    'type' => 'payment_approved',
                    'data' => ['reference' => $intent?->reference],
                ]);
            }

            if ($intent) {
                $this->createLessonsForIntent($intent);
            }
        });

        $manualPayment->refresh();
        $parent = User::query()->find($manualPayment->parent_id);
        $parentEmail = $parent?->email;
        $intent = BookingIntent::query()->find($manualPayment->booking_intent_id);
        $reference = $intent?->reference;

        $adminEmail = config('payments.admin_email');
        if (is_string($adminEmail) && $adminEmail !== '' && config('mail.default')) {
            try {
                Mail::raw(
                    "Payment approved.\nPayment ID: {$manualPayment->id}\n",
                    fn ($m) => $m->to($adminEmail)->subject("Payment approved {$manualPayment->id}")
                );
            } catch (\Throwable $e) {
            }
        }

        if (is_string($parentEmail) && $parentEmail !== '' && config('mail.default')) {
            try {
                $amountNaira = (int) floor($amountKobo / 100);
                $body = "Your payment has been approved.\nReference: {$reference}\nWallet credited: ₦{$amountNaira}\nYou can now book/attend your lessons.\n";
                Mail::raw($body, fn ($m) => $m->to($parentEmail)->subject('Payment approved'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Payment approved. Wallet credited and lessons scheduled.');
    }

    public function reject(Request $request, ManualPayment $manualPayment)
    {
        $user = $request->user();
        abort_unless($user && (string) $user->role === 'superadmin', 403);

        $data = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($manualPayment, $data) {
            $manualPayment->refresh();
            if ((string) $manualPayment->status !== 'pending') {
                return;
            }

            $manualPayment->status = 'rejected';
            $manualPayment->admin_notes = $data['admin_notes'] ?? null;
            $manualPayment->save();

            $intent = BookingIntent::query()->find($manualPayment->booking_intent_id);
            if ($intent) {
                $intent->status = 'rejected';
                $intent->save();
            }

            SimpleNotification::create([
                'user_id' => $manualPayment->parent_id,
                'type' => 'payment_rejected',
                'data' => [
                    'reason' => $manualPayment->admin_notes,
                    'reference' => $intent?->reference,
                ],
            ]);
        });

        $manualPayment->refresh();
        $parent = User::query()->find($manualPayment->parent_id);
        $intent = BookingIntent::query()->find($manualPayment->booking_intent_id);
        if ($parent && $parent->email && config('mail.default')) {
            try {
                $body = "Your payment was rejected.\nReference: {$intent?->reference}\nReason: {$manualPayment->admin_notes}\nYou can resubmit payment confirmation.\n";
                Mail::raw($body, fn ($m) => $m->to($parent->email)->subject('Payment rejected'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Payment rejected.');
    }
}
