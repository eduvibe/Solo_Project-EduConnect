import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function FundWallet() {
    const flash = usePage().props.flash;
    const bank = usePage().props.bank;
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        router.post(
            route('wallet.funding.store'),
            { amount_naira: amount },
            { onError: (e2) => setErrors(e2 || {}), preserveScroll: true },
        );
    };

    return (
        <DashboardLayout title="Fund wallet">
            <Head title="Fund wallet" />

            {flash?.status && (
                <div className="mb-6 bg-[#9dff52] px-4 py-3 text-base font-semibold text-black">
                    {flash.status}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-lg font-semibold">Fund your wallet</div>
                        <div className="dash-muted mt-1 text-sm">
                            Add funds now and use them later for lessons.
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <div className="dash-muted-strong text-sm">Amount (₦)</div>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                    inputMode="numeric"
                                    required
                                />
                                <InputError message={errors.amount_naira} className="mt-2" />
                            </div>

                            <button type="submit" className="dash-btn-green px-5 py-3 text-base">
                                Proceed to payment
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">Bank details</div>
                        <div className="dash-muted mt-3 text-sm">Bank: {bank?.bank_name}</div>
                        <div className="dash-muted mt-1 text-sm">Account number: {bank?.account_number}</div>
                        <div className="dash-muted mt-1 text-sm">Account name: {bank?.account_name}</div>
                        <div className="dash-muted mt-4 text-sm">
                            You’ll get a unique reference after you enter the amount.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

