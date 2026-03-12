<?php

namespace App\Http\Controllers;

use App\Models\PayoutRequest;
use App\Models\SimpleNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $payoutRequest->status = 'paid';
        $payoutRequest->reviewed_by = $request->user()->id;
        $payoutRequest->reviewed_at = now();
        $payoutRequest->save();

        if (Schema::hasTable('simple_notifications')) {
            SimpleNotification::create([
                'user_id' => $payoutRequest->tutor_id,
                'type' => 'payout_paid',
                'data' => ['amount_cents' => $payoutRequest->amount_cents],
            ]);
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

            $tutor = User::query()->find($payoutRequest->tutor_id);
            if ($tutor) {
                $tutor->increment('balance_cents', (int) $payoutRequest->amount_cents);
            }
        });

        if (Schema::hasTable('simple_notifications')) {
            SimpleNotification::create([
                'user_id' => $payoutRequest->tutor_id,
                'type' => 'payout_rejected',
                'data' => ['note' => $data['note'], 'amount_cents' => $payoutRequest->amount_cents],
            ]);
        }

        return back()->with('status', 'Payout rejected.');
    }
}

