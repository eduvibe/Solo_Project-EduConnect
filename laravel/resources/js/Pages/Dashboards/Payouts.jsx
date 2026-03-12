import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, router } from '@inertiajs/react';

export default function Payouts() {
    const balanceCents = usePage().props.balance_cents || 0;
    const payouts = usePage().props.payouts || [];

    const requestPayout = () => {
        router.post(route('payouts.request'), {}, { preserveScroll: true });
    };

    return (
        <DashboardLayout title="Payouts">
            <Head title="Payouts" />

            <div className="bg-black p-6 text-white shadow-sm">
                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div className="border border-white/10 bg-black p-6">
                            <div className="text-sm font-semibold text-white/70">Available balance</div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                ₦{(balanceCents / 100).toLocaleString()}
                            </div>
                            <button
                                type="button"
                                onClick={requestPayout}
                                className="mt-4 bg-[#9dff52] px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
                                disabled={balanceCents <= 0}
                            >
                                Request payout
                            </button>
                            <div className="mt-3 text-sm text-white/60">
                                Requests are reviewed by admin. You’ll see an expected date once processing starts.
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="border border-white/10 bg-black p-6">
                            <div className="text-sm font-semibold text-white/70">Payout requests</div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-white/50">
                                            <th className="px-3 py-2">Requested</th>
                                            <th className="px-3 py-2">Amount</th>
                                            <th className="px-3 py-2">Expected date</th>
                                            <th className="px-3 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {payouts.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-3 py-3 text-sm text-white/80">{p.created_at}</td>
                                                <td className="px-3 py-3 text-sm font-semibold text-white">
                                                    ₦{(p.amount_cents / 100).toLocaleString()}
                                                </td>
                                                <td className="px-3 py-3 text-sm text-white/80">{p.expected_date || '—'}</td>
                                                <td className="px-3 py-3 text-sm text-white/80">{p.status}</td>
                                            </tr>
                                        ))}
                                        {payouts.length === 0 && (
                                            <tr>
                                                <td className="px-3 py-6 text-sm text-white/70" colSpan={4}>
                                                    No payout requests yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
