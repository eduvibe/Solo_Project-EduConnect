<?php

namespace App\Http\Controllers;

use App\Models\BookingIntent;
use App\Models\ManualPayment;
use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingFlowController extends Controller
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

    private function generateReference(): string
    {
        return 'PAY-' . strtoupper(Str::random(8));
    }

    public function bookTutor(Request $request, User $tutor)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless((string) $tutor->role === 'teacher', 404);
        if (Schema::hasColumn('users', 'disabled_at')) {
            abort_if($tutor->disabled_at !== null, 404);
        }

        return Inertia::render('Dashboards/BookTutor', [
            'tutor' => [
                'id' => $tutor->id,
                'name' => $tutor->name,
                'hourly_rate_cents' => (int) ($tutor->hourly_rate_cents ?? 0),
                'availability' => $tutor->availability,
                'location' => $tutor->location,
            ],
            'wallet_balance_kobo' => (int) ($user->wallet_balance_kobo ?? 0),
        ]);
    }

    public function createIntent(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless(Schema::hasTable('booking_intents'), 503);
        abort_unless(Schema::hasColumn('users', 'hourly_rate_cents'), 503);

        $data = $request->validate([
            'tutor_id' => ['required', 'integer', 'exists:users,id'],
            'kind' => ['required', 'string', 'in:trial,subscription'],
            'day_of_week' => ['nullable', 'string', 'max:16'],
            'start_time' => ['nullable'],
            'lessons_per_week' => ['nullable', 'integer', 'in:1,2,3,5'],
        ]);

        $tutor = User::query()->findOrFail($data['tutor_id']);
        abort_unless((string) $tutor->role === 'teacher', 404);

        $hourlyKobo = (int) ($tutor->hourly_rate_cents ?? 0);
        abort_if($hourlyKobo <= 0, 422, 'Tutor has no hourly rate set.');

        $kind = (string) $data['kind'];
        $weeks = 4;
        $durationMinutes = 60;
        $lessonsPerWeek = null;
        $totalLessons = 1;
        $amountKobo = $hourlyKobo;
        $dayOfWeek = null;
        $startTime = null;

        if ($kind === 'trial') {
            $dayOfWeek = $data['day_of_week'] ?? null;
            $startTime = $data['start_time'] ?? null;
            abort_if(! $dayOfWeek || ! $startTime, 422, 'Select a day and time.');
            $availability = is_array($tutor->availability) ? $tutor->availability : [];
            $key = strtolower((string) $dayOfWeek);
            $row = $availability[$key] ?? null;
            abort_if(! is_array($row) || empty($row['enabled']), 422, 'Selected slot is not available.');
            $start = (string) ($row['start'] ?? '');
            $end = (string) ($row['end'] ?? '');
            abort_if($start === '' || $end === '', 422, 'Tutor availability is incomplete.');
            abort_if((string) $startTime < $start || (string) $startTime > $end, 422, 'Selected time is outside availability.');
            $totalLessons = 1;
            $amountKobo = $hourlyKobo;
        } else {
            $lessonsPerWeek = (int) ($data['lessons_per_week'] ?? 0);
            abort_if(! in_array($lessonsPerWeek, [1, 2, 3, 5], true), 422, 'Choose lessons per week.');
            $totalLessons = $lessonsPerWeek * $weeks;
            $amountKobo = $hourlyKobo * $totalLessons;
        }

        $reference = $this->generateReference();

        $intent = DB::transaction(function () use ($user, $tutor, $kind, $durationMinutes, $lessonsPerWeek, $weeks, $totalLessons, $dayOfWeek, $startTime, $hourlyKobo, $amountKobo, $reference) {
            return BookingIntent::create([
                'parent_id' => $user->id,
                'tutor_id' => $tutor->id,
                'kind' => $kind,
                'duration_minutes' => $durationMinutes,
                'lessons_per_week' => $lessonsPerWeek,
                'weeks' => $weeks,
                'total_lessons' => $totalLessons,
                'day_of_week' => $dayOfWeek,
                'start_time' => $startTime,
                'tutor_rate_kobo' => $hourlyKobo,
                'amount_kobo' => $amountKobo,
                'reference' => $reference,
                'status' => 'awaiting_payment',
            ]);
        });

        return redirect()->route('payments.instructions', $intent->id);
    }

    public function paymentInstructions(Request $request, BookingIntent $bookingIntent)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless((int) $bookingIntent->parent_id === (int) $user->id, 403);

        $tutor = $bookingIntent->tutor()->first(['id', 'name']);

        return Inertia::render('Dashboards/PaymentInstructions', [
            'booking' => [
                'id' => $bookingIntent->id,
                'reference' => $bookingIntent->reference,
                'kind' => $bookingIntent->kind,
                'amount_kobo' => (int) $bookingIntent->amount_kobo,
                'duration_minutes' => (int) $bookingIntent->duration_minutes,
                'total_lessons' => (int) $bookingIntent->total_lessons,
                'status' => $bookingIntent->status,
                'tutor' => $tutor ? ['id' => $tutor->id, 'name' => $tutor->name] : null,
            ],
            'bank' => [
                'bank_name' => config('payments.bank_name'),
                'account_number' => config('payments.account_number'),
                'account_name' => config('payments.account_name'),
            ],
        ]);
    }

    public function submitPayment(Request $request, BookingIntent $bookingIntent)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless((int) $bookingIntent->parent_id === (int) $user->id, 403);
        abort_unless(Schema::hasTable('manual_payments'), 503);

        $data = $request->validate([
            'payment_reference' => ['required', 'string', 'max:100'],
            'amount_naira' => ['required', 'numeric', 'min:0'],
            'receipt' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $amountKobo = (int) round(((float) $data['amount_naira']) * 100);
        abort_if($amountKobo !== (int) $bookingIntent->amount_kobo, 422, 'Amount must match the total due.');

        $path = null;
        if (isset($data['receipt'])) {
            $base = "payments/{$user->id}/{$bookingIntent->id}";
            $path = $data['receipt']->storePublicly($base, 'public');
        }

        DB::transaction(function () use ($bookingIntent, $user, $data, $path, $amountKobo) {
            ManualPayment::create([
                'booking_intent_id' => $bookingIntent->id,
                'parent_id' => $user->id,
                'amount_kobo' => $amountKobo,
                'payment_reference' => $data['payment_reference'],
                'screenshot_path' => $path,
                'status' => 'pending',
            ]);

            $bookingIntent->update(['status' => 'payment_submitted']);

            SimpleNotification::create([
                'user_id' => $user->id,
                'type' => 'payment_submitted',
                'data' => ['reference' => $bookingIntent->reference],
            ]);
        });

        $adminEmail = config('payments.admin_email');
        if (is_string($adminEmail) && $adminEmail !== '' && config('mail.default')) {
            try {
                Mail::raw(
                    "New payment submitted.\nReference: {$bookingIntent->reference}\nParent ID: {$user->id}\n",
                    fn ($m) => $m->to($adminEmail)->subject("Payment submitted {$bookingIntent->reference}")
                );
            } catch (\Throwable $e) {
            }
        }

        return redirect()
            ->route('payments.instructions', $bookingIntent->id)
            ->with('status', 'Payment submitted. Awaiting confirmation.');
    }

    public function wallet(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);

        $tx = [];
        if (Schema::hasTable('wallet_transactions')) {
            $tx = WalletTransaction::query()
                ->where('user_id', $user->id)
                ->where('wallet_type', 'parent')
                ->orderByDesc('created_at')
                ->take(100)
                ->get(['id', 'type', 'amount_kobo', 'reference', 'created_at'])
                ->map(function (WalletTransaction $t) {
                    return [
                        'id' => $t->id,
                        'type' => $t->type,
                        'amount_kobo' => (int) $t->amount_kobo,
                        'reference' => $t->reference,
                        'created_at' => $t->created_at ? $t->created_at->toDateTimeString() : null,
                    ];
                })
                ->values()
                ->all();
        }

        return Inertia::render('Dashboards/Wallet', [
            'transactions' => $tx,
        ]);
    }
}
