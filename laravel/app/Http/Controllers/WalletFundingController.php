<?php

namespace App\Http\Controllers;

use App\Models\SimpleNotification;
use App\Models\User;
use App\Models\WalletFundingIntent;
use App\Models\WalletFundingPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WalletFundingController extends Controller
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
        return 'TOPUP-' . strtoupper(Str::random(8));
    }

    public function create(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);

        return Inertia::render('Dashboards/FundWallet', [
            'bank' => [
                'bank_name' => config('payments.bank_name'),
                'account_number' => config('payments.account_number'),
                'account_name' => config('payments.account_name'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless(Schema::hasTable('wallet_funding_intents'), 503);

        $data = $request->validate([
            'amount_naira' => ['required', 'numeric', 'min:0'],
        ]);

        $amountKobo = (int) round(((float) $data['amount_naira']) * 100);
        abort_if($amountKobo <= 0, 422, 'Amount must be greater than zero.');

        $intent = DB::transaction(function () use ($user, $amountKobo) {
            return WalletFundingIntent::create([
                'parent_id' => $user->id,
                'amount_kobo' => $amountKobo,
                'reference' => $this->generateReference(),
                'status' => 'awaiting_payment',
            ]);
        });

        return redirect()->route('wallet.funding.instructions', $intent->id);
    }

    public function instructions(Request $request, WalletFundingIntent $walletFundingIntent)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless((int) $walletFundingIntent->parent_id === (int) $user->id, 403);

        return Inertia::render('Dashboards/WalletFundingInstructions', [
            'intent' => [
                'id' => $walletFundingIntent->id,
                'reference' => $walletFundingIntent->reference,
                'amount_kobo' => (int) $walletFundingIntent->amount_kobo,
                'status' => $walletFundingIntent->status,
            ],
            'bank' => [
                'bank_name' => config('payments.bank_name'),
                'account_number' => config('payments.account_number'),
                'account_name' => config('payments.account_name'),
            ],
        ]);
    }

    public function submit(Request $request, WalletFundingIntent $walletFundingIntent)
    {
        $user = $request->user();
        abort_unless($user && $this->effectiveRole($request) === 'parent', 403);
        abort_unless((int) $walletFundingIntent->parent_id === (int) $user->id, 403);
        abort_unless(Schema::hasTable('wallet_funding_payments'), 503);

        $data = $request->validate([
            'payment_reference' => ['required', 'string', 'max:100'],
            'amount_naira' => ['required', 'numeric', 'min:0'],
            'receipt' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $amountKobo = (int) round(((float) $data['amount_naira']) * 100);
        abort_if($amountKobo !== (int) $walletFundingIntent->amount_kobo, 422, 'Amount must match the total due.');

        $path = null;
        if (isset($data['receipt'])) {
            $base = "wallet-topups/{$user->id}/{$walletFundingIntent->id}";
            $path = $data['receipt']->storePublicly($base, 'public');
        }

        DB::transaction(function () use ($walletFundingIntent, $user, $data, $path, $amountKobo) {
            WalletFundingPayment::create([
                'wallet_funding_intent_id' => $walletFundingIntent->id,
                'parent_id' => $user->id,
                'amount_kobo' => $amountKobo,
                'payment_reference' => $data['payment_reference'],
                'receipt_path' => $path,
                'status' => 'pending',
            ]);

            $walletFundingIntent->update(['status' => 'payment_submitted']);

            SimpleNotification::create([
                'user_id' => $user->id,
                'type' => 'wallet_funding_submitted',
                'data' => ['reference' => $walletFundingIntent->reference],
            ]);
        });

        $adminEmail = config('payments.admin_email');
        if (is_string($adminEmail) && $adminEmail !== '' && config('mail.default')) {
            try {
                Mail::raw(
                    "New wallet top-up submitted.\nReference: {$walletFundingIntent->reference}\nParent ID: {$user->id}\n",
                    fn ($m) => $m->to($adminEmail)->subject("Wallet top-up submitted {$walletFundingIntent->reference}")
                );
            } catch (\Throwable $e) {
            }
        }

        return redirect()
            ->route('wallet.funding.instructions', $walletFundingIntent->id)
            ->with('status', 'Wallet top-up submitted. Awaiting confirmation.');
    }
}

