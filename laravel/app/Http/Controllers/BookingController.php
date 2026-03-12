<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    private function firstAvailabilityDayLabel(?array $availability): string
    {
        $map = [
            'monday' => 'Monday',
            'tuesday' => 'Tuesday',
            'wednesday' => 'Wednesday',
            'thursday' => 'Thursday',
            'friday' => 'Friday',
            'saturday' => 'Saturday',
            'sunday' => 'Sunday',
        ];

        foreach ($map as $key => $label) {
            $row = $availability[$key] ?? null;
            if (! is_array($row)) {
                continue;
            }
            if (! empty($row['enabled'])) {
                return $label;
            }
        }

        return 'Friday';
    }

    // Parent confirms a booking intent — creates agreement (pending tutor acceptance) and records payment to platform.
    public function confirm(Request $request)
    {
        $parent = $request->user();
        abort_unless((string) $parent->role === 'parent' || (string) $parent->role === 'superadmin', 403);

        $data = $request->validate([
            'teacher_id' => ['required', 'integer', 'exists:users,id'],
            'sessions' => ['required', 'integer', 'min:1'],
        ]);

        $teacher = User::query()->findOrFail($data['teacher_id']);
        abort_unless((string) $teacher->role === 'teacher', 404);

        $hourlyCents = (int) ($teacher->hourly_rate_cents ?? 0);
        abort_if($hourlyCents <= 0, 422, 'Tutor has no hourly rate set.');
        $sessions = (int) $data['sessions'];
        $totalCents = $hourlyCents * $sessions;
        $feeBps = 1000; // 10%
        $feeCents = (int) floor($totalCents * $feeBps / 10000);
        $netCents = $totalCents - $feeCents;
        $payDay = $this->firstAvailabilityDayLabel($teacher->availability);

        DB::transaction(function () use ($parent, $teacher, $hourlyCents, $sessions, $totalCents, $feeBps, $feeCents, $netCents, $payDay) {
            $agreement = Agreement::updateOrCreate(
                [
                    'teacher_id' => $teacher->id,
                    'parent_id' => $parent->id,
                ],
                [
                    'status' => 'pending_teacher',
                    'hourly_rate_cents' => $hourlyCents,
                    'sessions_count' => $sessions,
                    'total_cents' => $totalCents,
                    'pay_day' => $payDay,
                    'service_fee_bps' => $feeBps,
                ]
            );

            // Record payment from parent to platform, held until tutor accepts
            Transaction::create([
                'agreement_id' => $agreement->id,
                'payer_id' => $parent->id,
                'tutor_id' => $teacher->id,
                'amount_cents' => $totalCents,
                'fee_cents' => $feeCents,
                'net_cents' => $netCents,
                'status' => 'held',
                'description' => 'Lesson pack payment (held until tutor accepts)',
            ]);

            // Increase parent's lifetime spend immediately
            $parent->increment('spent_cents', $totalCents);
        });

        return back()->with('status', 'Booking confirmed. Awaiting tutor acceptance.');
    }

    // Tutor accepts agreement — credits tutor balance with net amount, marks agreement as signed and transactions cleared
    public function tutorAccept(Request $request, Agreement $agreement)
    {
        $tutor = $request->user();
        abort_unless((int) $agreement->teacher_id === (int) $tutor->id, 403);

        DB::transaction(function () use ($agreement, $tutor) {
            $agreement->update([
                'status' => 'signed',
                'accepted_by_teacher' => true,
                'accepted_at' => now(),
            ]);

            $held = Transaction::query()
                ->where('agreement_id', $agreement->id)
                ->where('status', 'held')
                ->get();

            foreach ($held as $tx) {
                $tx->update(['status' => 'cleared']);
                $tutor->increment('balance_cents', $tx->net_cents);
            }
        });

        return back()->with('status', 'Agreement accepted. Earnings credited.');
    }
}
