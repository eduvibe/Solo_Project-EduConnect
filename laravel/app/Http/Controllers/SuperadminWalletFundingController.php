<?php

namespace App\Http\Controllers;

use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\WalletFundingIntent;
use App\Models\WalletFundingPayment;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SuperadminWalletFundingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user && (string) $user->role === 'superadmin', 403);

        $payments = [];
        if (Schema::hasTable('wallet_funding_payments')) {
            $payments = WalletFundingPayment::query()
                ->with([
                    'parent:id,name,email',
                    'intent:id,reference,amount_kobo,status,parent_id,created_at',
                ])
                ->where('status', 'pending')
                ->orderByDesc('created_at')
                ->take(100)
                ->get()
                ->map(function (WalletFundingPayment $p) {
                    return [
                        'id' => $p->id,
                        'amount_kobo' => (int) $p->amount_kobo,
                        'payment_reference' => $p->payment_reference,
                        'receipt_path' => $p->receipt_path,
                        'created_at' => $p->created_at ? $p->created_at->toDateTimeString() : null,
                        'parent' => $p->parent ? [
                            'id' => $p->parent->id,
                            'name' => $p->parent->name,
                            'email' => $p->parent->email,
                        ] : null,
                        'intent' => $p->intent ? [
                            'id' => $p->intent->id,
                            'reference' => $p->intent->reference,
                            'amount_kobo' => (int) $p->intent->amount_kobo,
                            'status' => $p->intent->status,
                        ] : null,
                    ];
                })
                ->values();
        }

        return Inertia::render('Dashboards/SuperadminWalletFundings', [
            'payments' => $payments,
        ]);
    }

    public function approve(Request $request, WalletFundingPayment $walletFundingPayment)
    {
        $user = $request->user();
        abort_unless($user && (string) $user->role === 'superadmin', 403);
        abort_unless(Schema::hasColumn('users', 'wallet_balance_kobo'), 503);
        abort_unless(Schema::hasTable('wallet_transactions'), 503);

        $parentEmail = null;
        $reference = null;
        $amountKobo = (int) $walletFundingPayment->amount_kobo;

        DB::transaction(function () use ($walletFundingPayment) {
            $walletFundingPayment->refresh();
            if ((string) $walletFundingPayment->status !== 'pending') {
                return;
            }

            $walletFundingPayment->status = 'approved';
            $walletFundingPayment->approved_at = now();
            $walletFundingPayment->save();

            $intent = WalletFundingIntent::query()->find($walletFundingPayment->wallet_funding_intent_id);
            if ($intent) {
                $intent->status = 'approved';
                $intent->save();
            }

            $parent = User::query()->lockForUpdate()->find($walletFundingPayment->parent_id);
            if ($parent) {
                $parent->increment('wallet_balance_kobo', (int) $walletFundingPayment->amount_kobo);
                WalletTransaction::create([
                    'user_id' => $parent->id,
                    'wallet_type' => 'parent',
                    'amount_kobo' => (int) $walletFundingPayment->amount_kobo,
                    'type' => 'payment',
                    'reference' => $intent ? $intent->reference : null,
                    'meta' => [
                        'wallet_funding_payment_id' => $walletFundingPayment->id,
                        'wallet_funding_intent_id' => $intent?->id,
                    ],
                ]);

                SimpleNotification::create([
                    'user_id' => $parent->id,
                    'type' => 'wallet_funding_approved',
                    'data' => ['reference' => $intent?->reference],
                ]);
            }
        });

        $walletFundingPayment->refresh();
        $parent = User::query()->find($walletFundingPayment->parent_id);
        $parentEmail = $parent?->email;
        $intent = WalletFundingIntent::query()->find($walletFundingPayment->wallet_funding_intent_id);
        $reference = $intent?->reference;

        if (is_string($parentEmail) && $parentEmail !== '' && config('mail.default')) {
            try {
                $amountNaira = (int) floor($amountKobo / 100);
                $body = "Your wallet top-up has been approved.\nReference: {$reference}\nWallet credited: ₦{$amountNaira}\n";
                Mail::raw($body, fn ($m) => $m->to($parentEmail)->subject('Wallet top-up approved'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Wallet top-up approved. Wallet credited.');
    }

    public function reject(Request $request, WalletFundingPayment $walletFundingPayment)
    {
        $user = $request->user();
        abort_unless($user && (string) $user->role === 'superadmin', 403);

        $data = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($walletFundingPayment, $data) {
            $walletFundingPayment->refresh();
            if ((string) $walletFundingPayment->status !== 'pending') {
                return;
            }

            $walletFundingPayment->status = 'rejected';
            $walletFundingPayment->admin_notes = $data['admin_notes'] ?? null;
            $walletFundingPayment->save();

            $intent = WalletFundingIntent::query()->find($walletFundingPayment->wallet_funding_intent_id);
            if ($intent) {
                $intent->status = 'rejected';
                $intent->save();
            }

            SimpleNotification::create([
                'user_id' => $walletFundingPayment->parent_id,
                'type' => 'wallet_funding_rejected',
                'data' => [
                    'reference' => $intent?->reference,
                    'reason' => $walletFundingPayment->admin_notes,
                ],
            ]);
        });

        $walletFundingPayment->refresh();
        $parent = User::query()->find($walletFundingPayment->parent_id);
        $intent = WalletFundingIntent::query()->find($walletFundingPayment->wallet_funding_intent_id);
        if ($parent && $parent->email && config('mail.default')) {
            try {
                $body = "Your wallet top-up was rejected.\nReference: {$intent?->reference}\nReason: {$walletFundingPayment->admin_notes}\n";
                Mail::raw($body, fn ($m) => $m->to($parent->email)->subject('Wallet top-up rejected'));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('status', 'Wallet top-up rejected.');
    }
}

