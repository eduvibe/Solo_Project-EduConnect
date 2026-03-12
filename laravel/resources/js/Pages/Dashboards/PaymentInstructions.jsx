import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function PaymentInstructions({ booking, bank }) {
    const flash = usePage().props.flash;
    const [data, setData] = useState({
        payment_reference: '',
        amount_naira: Number((booking?.amount_kobo || 0) / 100).toFixed(0),
        receipt: null,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const amountNaira = useMemo(() => Math.floor(Number(booking?.amount_kobo || 0) / 100), [booking?.amount_kobo]);

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const form = new FormData();
        form.append('payment_reference', data.payment_reference);
        form.append('amount_naira', data.amount_naira);
        if (data.receipt) form.append('receipt', data.receipt);

        router.post(route('payments.submit', booking.id), form, {
            forceFormData: true,
            onError: (e2) => setErrors(e2 || {}),
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout title="Payment">
            <Head title="Payment" />

            {flash?.status && (
                <div className="mb-6 bg-[#9dff52] px-4 py-3 text-base font-semibold text-black">
                    {flash.status}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-lg font-semibold">Bank transfer</div>
                        <div className="dash-muted mt-1 text-sm">
                            Transfer the exact amount and use the reference below.
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="dash-surface p-4">
                                <div className="dash-muted-strong text-sm font-semibold">Amount due</div>
                                <div className="dash-title mt-2 text-2xl font-bold">₦{amountNaira.toLocaleString()}</div>
                            </div>

                            <div className="dash-surface p-4">
                                <div className="dash-muted-strong text-sm font-semibold">Bank details</div>
                                <div className="dash-muted mt-2 text-sm">Bank: {bank?.bank_name}</div>
                                <div className="dash-muted mt-1 text-sm">Account number: {bank?.account_number}</div>
                                <div className="dash-muted mt-1 text-sm">Account name: {bank?.account_name}</div>
                            </div>

                            <div className="dash-surface p-4">
                                <div className="dash-muted-strong text-sm font-semibold">Payment reference</div>
                                <div className="dash-title mt-2 text-xl font-bold">{booking?.reference}</div>
                                <div className="dash-muted mt-2 text-sm">
                                    Put this in your transfer narration so admin can match it quickly.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-lg font-semibold">Confirm payment</div>
                        <div className="dash-muted mt-1 text-sm">
                            After transfer, submit your bank transaction reference.
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <div className="dash-muted-strong text-sm">Transaction reference (from bank)</div>
                                <input
                                    value={data.payment_reference}
                                    onChange={(e) => setData((p) => ({ ...p, payment_reference: e.target.value }))}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                    required
                                />
                                <InputError message={errors.payment_reference} className="mt-2" />
                            </div>

                            <div>
                                <div className="dash-muted-strong text-sm">Amount paid (₦)</div>
                                <input
                                    value={data.amount_naira}
                                    onChange={(e) => setData((p) => ({ ...p, amount_naira: e.target.value }))}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                    inputMode="numeric"
                                    required
                                />
                                <InputError message={errors.amount_naira} className="mt-2" />
                            </div>

                            <div>
                                <div className="dash-muted-strong text-sm">Receipt (optional)</div>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setData((p) => ({ ...p, receipt: e.target.files?.[0] || null }))}
                                    className="dash-muted mt-2 block w-full text-sm"
                                />
                                <InputError message={errors.receipt} className="mt-2" />
                            </div>

                            <button type="submit" disabled={processing} className="dash-btn-green px-5 py-3 text-base">
                                Submit for confirmation
                            </button>

                            <div className="dash-muted text-sm">
                                Admin will confirm within 24 hours. You’ll be notified once your wallet is credited.
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

