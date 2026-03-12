<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless((string) $user->role === 'teacher' || (string) $user->role === 'superadmin', 403);
        $transactions = [];

        if (Schema::hasTable('transactions')) {
            $transactions = Transaction::query()
                ->where('tutor_id', $user->id)
                ->whereIn('status', ['cleared', 'paid_out'])
                ->orderByDesc('created_at')
                ->take(50)
                ->get();
        }

        return Inertia::render('Dashboards/Payouts', [
            'balance_cents' => (int) ($user->balance_cents ?? 0),
            'transactions' => $transactions,
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

        DB::transaction(function () use ($user, $balance) {
            Transaction::create([
                'agreement_id' => null,
                'payer_id' => $user->id,
                'tutor_id' => $user->id,
                'amount_cents' => -$balance,
                'fee_cents' => 0,
                'net_cents' => -$balance,
                'status' => 'paid_out',
                'description' => 'Payout requested',
            ]);
            $user->decrement('balance_cents', $balance);
        });

        return back()->with('status', 'Payout requested. We will process shortly.');
    }
}
