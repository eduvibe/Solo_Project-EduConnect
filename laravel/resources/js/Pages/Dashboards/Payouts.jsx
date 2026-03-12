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

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-muted-strong text-sm font-semibold">Available balance</div>
                        <div className="dash-title mt-2 text-3xl font-bold">
                            ₦{(balanceCents / 100).toLocaleString()}
                        </div>
                        <button
                            type="button"
                            onClick={requestPayout}
                            className="dash-btn-green mt-4 px-5 py-3"
                            disabled={balanceCents <= 0}
                        >
                            Request payout
                        </button>
                        <div className="dash-muted mt-3 text-sm">
                            Requests are reviewed by admin. You’ll see an expected date once processing starts.
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="dash-muted-strong text-sm font-semibold">Payout requests</div>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">Requested</th>
                                        <th className="px-3 py-2">Amount</th>
                                        <th className="px-3 py-2">Expected date</th>
                                        <th className="px-3 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {payouts.map((p) => (
                                        <tr key={p.id}>
                                            <td className="dash-muted px-3 py-3 text-sm">{p.created_at}</td>
                                            <td className="dash-title px-3 py-3 text-sm font-semibold">
                                                ₦{(p.amount_cents / 100).toLocaleString()}
                                            </td>
                                            <td className="dash-muted px-3 py-3 text-sm">{p.expected_date || '—'}</td>
                                            <td className="dash-muted px-3 py-3 text-sm">{p.status}</td>
                                        </tr>
                                    ))}
                                    {payouts.length === 0 && (
                                        <tr>
                                            <td className="dash-muted px-3 py-6 text-sm" colSpan={4}>
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
        </DashboardLayout>
    );
}
