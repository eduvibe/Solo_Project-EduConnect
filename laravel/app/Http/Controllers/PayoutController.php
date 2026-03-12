<?php

namespace App\Http\Controllers;

use App\Mail\PayoutRequestedMail;
use App\Models\PayoutRequest;
use App\Models\Transaction;
use App\Models\SimpleNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless((string) $user->role === 'teacher' || (string) $user->role === 'superadmin', 403);
        $payouts = [];

        if (Schema::hasTable('payout_requests')) {
            $payouts = PayoutRequest::query()
                ->where('tutor_id', $user->id)
                ->orderByDesc('created_at')
                ->take(50)
                ->get();
        }

        return Inertia::render('Dashboards/Payouts', [
            'balance_cents' => (int) ($user->balance_cents ?? 0),
            'payouts' => $payouts,
        ]);
    }

    public function request(Request $request)
    {
        $user = $request->user();
        abort_unless((string) $user->role === 'teacher' || (string) $user->role === 'superadmin', 403);

        $balance = (int) ($user->balance_cents ?? 0);
        if ($balance <= 0) {
            return back()->with('status', 'No balance to payout.');
        }

        $payout = null;
        DB::transaction(function () use ($user, $balance, &$payout) {
            $payout = PayoutRequest::create([
                'tutor_id' => $user->id,
                'amount_cents' => $balance,
                'status' => 'requested',
                'expected_date' => now()->addDays(2)->toDateString(),
            ]);

            Transaction::create([
                'agreement_id' => null,
                'payer_id' => $user->id,
                'tutor_id' => $user->id,
                'amount_cents' => -$balance,
                'fee_cents' => 0,
                'net_cents' => -$balance,
                'status' => 'payout_requested',
                'description' => 'Payout requested',
            ]);

            $user->decrement('balance_cents', $balance);
        });

        if (Schema::hasTable('simple_notifications')) {
            $admins = User::query()->whereIn('role', ['admin', 'superadmin'])->get(['id', 'email', 'name']);
            foreach ($admins as $admin) {
                SimpleNotification::create([
                    'user_id' => $admin->id,
                    'type' => 'payout_requested',
                    'data' => [
                        'tutor_id' => $user->id,
                        'tutor_name' => $user->name,
                        'amount_cents' => $balance,
                        'payout_request_id' => $payout?->id,
                    ],
                ]);
            }

            if ($admins->count() > 0) {
                try {
                    Mail::to($admins->pluck('email')->all())->send(new PayoutRequestedMail($user, $payout));
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        return back()->with('status', 'Payout requested. We will process shortly.');
    }
}
