import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function SuperadminPayouts() {
    const payouts = usePage().props.payouts || [];
    const [expectedById, setExpectedById] = useState({});
    const [rejectNotesById, setRejectNotesById] = useState({});

    const setProcessing = (id) => {
        router.post(
            route('dashboard.superadmin.payouts.processing', id),
            { expected_date: expectedById[id] },
            { preserveScroll: true },
        );
    };

    const markPaid = (id) => {
        router.post(route('dashboard.superadmin.payouts.paid', id), {}, { preserveScroll: true });
    };

    const reject = (id) => {
        router.post(
            route('dashboard.superadmin.payouts.reject', id),
            { note: (rejectNotesById[id] || '').trim() },
            { preserveScroll: true },
        );
    };

    const canProcessing = useMemo(() => {
        const map = {};
        for (const p of payouts) {
            map[p.id] = String(expectedById[p.id] || '').trim().length > 0;
        }
        return map;
    }, [expectedById, payouts]);

    const canReject = useMemo(() => {
        const map = {};
        for (const p of payouts) {
            map[p.id] = String(rejectNotesById[p.id] || '').trim().length > 0;
        }
        return map;
    }, [rejectNotesById, payouts]);

    return (
        <DashboardLayout title="Payout requests">
            <Head title="Payout requests" />

            <div className="dash-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold text-white">Payout requests</div>
                        <div className="mt-1 text-sm text-white/60">Set an expected date, mark paid, or reject with a note.</div>
                    </div>
                    <div className="text-sm font-semibold text-white">{payouts.length} total</div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                <th className="px-3 py-2">Tutor</th>
                                <th className="px-3 py-2">Requested</th>
                                <th className="px-3 py-2">Amount</th>
                                <th className="px-3 py-2">Expected date</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="dash-divider">
                            {payouts.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-semibold text-white">{p.tutor?.name}</div>
                                        <div className="text-sm text-white/60">{p.tutor?.email}</div>
                                        <div className="text-xs text-white/50">{p.tutor?.phone || ''}</div>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-white/70">{p.created_at}</td>
                                    <td className="px-3 py-3 text-sm font-semibold text-white">
                                        ₦{(p.amount_cents / 100).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="date"
                                            value={expectedById[p.id] ?? p.expected_date ?? ''}
                                            onChange={(e) => setExpectedById((m) => ({ ...m, [p.id]: e.target.value }))}
                                            className="w-44 border border-white/10 bg-black p-2 text-sm text-white"
                                        />
                                    </td>
                                    <td className="px-3 py-3 text-sm text-white/70">{p.status}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setProcessing(p.id)}
                                                disabled={!canProcessing[p.id]}
                                                className="dash-btn-green"
                                            >
                                                Set processing
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markPaid(p.id)}
                                                className="dash-btn-black"
                                            >
                                                Mark paid
                                            </button>
                                            <textarea
                                                value={rejectNotesById[p.id] ?? p.admin_note ?? ''}
                                                onChange={(e) => setRejectNotesById((m) => ({ ...m, [p.id]: e.target.value }))}
                                                rows={2}
                                                className="w-72 border border-white/10 bg-black p-2 text-sm text-white"
                                                placeholder="Rejection note"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => reject(p.id)}
                                                disabled={!canReject[p.id]}
                                                className="border border-white/10 bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr>
                                    <td className="px-3 py-6 text-sm text-white/70" colSpan={6}>
                                        No payout requests yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
