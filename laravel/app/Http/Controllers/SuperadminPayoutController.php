<?php

namespace App\Http\Controllers;

use App\Models\PayoutRequest;
use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SuperadminPayoutController extends Controller
{
    public function index(Request $request)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);

        $items = [];
        if (Schema::hasTable('payout_requests')) {
            $items = PayoutRequest::query()
                ->with('tutor:id,name,email,phone')
                ->orderByDesc('created_at')
                ->take(100)
                ->get();
        }

        return Inertia::render('Dashboards/SuperadminPayouts', [
            'payouts' => $items,
        ]);
    }

    public function setProcessing(Request $request, PayoutRequest $payoutRequest)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);

        $data = $request->validate([
            'expected_date' => ['required', 'date'],
        ]);

        $payoutRequest->status = 'processing';
        $payoutRequest->expected_date = $data['expected_date'];
        $payoutRequest->reviewed_by = $request->user()->id;
        $payoutRequest->reviewed_at = now();
        $payoutRequest->save();

        if (Schema::hasTable('simple_notifications')) {
            SimpleNotification::create([
                'user_id' => $payoutRequest->tutor_id,
                'type' => 'payout_processing',
                'data' => ['expected_date' => $payoutRequest->expected_date, 'amount_cents' => $payoutRequest->amount_cents],
            ]);
        }

        return back()->with('status', 'Payout marked as processing.');
    }

    public function markPaid(Request $request, PayoutRequest $payoutRequest)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);

        abort_unless(Schema::hasColumn('users', 'balance_cents'), 503);

        DB::transaction(function () use ($request, $payoutRequest) {
            $payoutRequest->refresh();
            if ((string) $payoutRequest->status === 'paid') {
                return;
            }

            $tutor = User::query()->lockForUpdate()->find($payoutRequest->tutor_id);
            if (! $tutor) {
                return;
            }

            $amount = (int) $payoutRequest->amount_cents;
            if ((int) $tutor->balance_cents < $amount) {
                $payoutRequest->status = 'rejected';
                $payoutRequest->admin_note = 'Insufficient balance at payout time.';
                $payoutRequest->reviewed_by = $request->user()->id;
                $payoutRequest->reviewed_at = now();
                $payoutRequest->save();
                return;
            }

            $tutor->decrement('balance_cents', $amount);

            if (Schema::hasTable('wallet_transactions')) {
                WalletTransaction::create([
                    'user_id' => $tutor->id,
                    'wallet_type' => 'tutor',
                    'amount_kobo' => -$amount,
                    'type' => 'payout',
                    'reference' => "payout_request:{$payoutRequest->id}",
                    'meta' => ['amount_cents' => $amount],
                ]);
            }

            $payoutRequest->status = 'paid';
            $payoutRequest->reviewed_by = $request->user()->id;
            $payoutRequest->reviewed_at = now();
            $payoutRequest->save();
        });

        if (Schema::hasTable('simple_notifications')) {
            SimpleNotification::create([
                'user_id' => $payoutRequest->tutor_id,
                'type' => 'payout_paid',
                'data' => ['amount_cents' => $payoutRequest->amount_cents],
            ]);
        }

        $tutor = User::query()->find($payoutRequest->tutor_id);
        if ($tutor && $tutor->email && config('mail.default')) {
            try {
                $amount = (int) $payoutRequest->amount_cents;
                $body = "Your payout has been marked as paid.\nAmount: ₦" . number_format($amount / 100, 2) . "\nRequest ID: {$payoutRequest->id}\n";
                Mail::raw($body, fn ($m) => $m->to($tutor->email)->subject('Payout paid'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Payout marked as paid.');
    }

    public function reject(Request $request, PayoutRequest $payoutRequest)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);

        $data = $request->validate([
            'note' => ['required', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($request, $payoutRequest, $data) {
            $payoutRequest->status = 'rejected';
            $payoutRequest->admin_note = $data['note'];
            $payoutRequest->reviewed_by = $request->user()->id;
            $payoutRequest->reviewed_at = now();
            $payoutRequest->save();
        });

        if (Schema::hasTable('simple_notifications')) {
            SimpleNotification::create([
                'user_id' => $payoutRequest->tutor_id,
                'type' => 'payout_rejected',
                'data' => ['note' => $data['note'], 'amount_cents' => $payoutRequest->amount_cents],
            ]);
        }

        $tutor = User::query()->find($payoutRequest->tutor_id);
        if ($tutor && $tutor->email && config('mail.default')) {
            try {
                $amount = (int) $payoutRequest->amount_cents;
                $body = "Your payout request was rejected.\nAmount: ₦" . number_format($amount / 100, 2) . "\nReason: {$data['note']}\nRequest ID: {$payoutRequest->id}\n";
                Mail::raw($body, fn ($m) => $m->to($tutor->email)->subject('Payout rejected'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Payout rejected.');
    }
}
