import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, router } from '@inertiajs/react';

export default function Payouts() {
    const balanceCents = usePage().props.balance_cents || 0;
    const transactions = usePage().props.transactions || [];

    const requestPayout = () => {
        router.post(route('payouts.request'), {}, { preserveScroll: true });
    };

    return (
        <DashboardLayout title="Payouts">
            <Head title="Payouts" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Balance</div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">
                            ₦{(balanceCents / 100).toLocaleString()}
                        </div>
                        <button
                            type="button"
                            onClick={requestPayout}
                            className="mt-4 bg-[#9dff52] px-5 py-3 text-base font-semibold text-black"
                            disabled={balanceCents <= 0}
                        >
                            Request payout
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Transactions</div>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="px-3 py-2">When</th>
                                        <th className="px-3 py-2">Type</th>
                                        <th className="px-3 py-2">Gross</th>
                                        <th className="px-3 py-2">Fee</th>
                                        <th className="px-3 py-2">Net</th>
                                        <th className="px-3 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td className="px-3 py-2 text-sm">{t.created_at}</td>
                                            <td className="px-3 py-2 text-sm">{t.description || '—'}</td>
                                            <td className="px-3 py-2 text-sm">₦{(t.amount_cents/100).toLocaleString()}</td>
                                            <td className="px-3 py-2 text-sm">₦{(t.fee_cents/100).toLocaleString()}</td>
                                            <td className="px-3 py-2 text-sm">₦{(t.net_cents/100).toLocaleString()}</td>
                                            <td className="px-3 py-2 text-sm">{t.status}</td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-base text-slate-700" colSpan={6}>
                                                No transactions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

