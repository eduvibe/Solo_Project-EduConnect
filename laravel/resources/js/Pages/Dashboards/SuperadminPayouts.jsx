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
                        <div className="dash-title text-lg font-semibold">Payout requests</div>
                        <div className="dash-muted mt-1 text-sm">Set an expected date, mark paid, or reject with a note.</div>
                    </div>
                    <div className="dash-title text-sm font-semibold">{payouts.length} total</div>
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
                                        <div className="dash-title text-sm font-semibold">{p.tutor?.name}</div>
                                        <div className="dash-muted text-sm">{p.tutor?.email}</div>
                                        <div className="dash-muted text-xs">{p.tutor?.phone || ''}</div>
                                    </td>
                                    <td className="dash-muted px-3 py-3 text-sm">{p.created_at}</td>
                                    <td className="dash-title px-3 py-3 text-sm font-semibold">
                                        ₦{(p.amount_cents / 100).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="date"
                                            value={expectedById[p.id] ?? p.expected_date ?? ''}
                                            onChange={(e) => setExpectedById((m) => ({ ...m, [p.id]: e.target.value }))}
                                            className="dash-input w-44 p-2 text-sm"
                                        />
                                    </td>
                                    <td className="dash-muted px-3 py-3 text-sm">{p.status}</td>
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
                                                className="dash-btn-neutral"
                                            >
                                                Mark paid
                                            </button>
                                            <textarea
                                                value={rejectNotesById[p.id] ?? p.admin_note ?? ''}
                                                onChange={(e) => setRejectNotesById((m) => ({ ...m, [p.id]: e.target.value }))}
                                                rows={2}
                                                className="dash-input w-72 p-2 text-sm"
                                                placeholder="Rejection note"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => reject(p.id)}
                                                disabled={!canReject[p.id]}
                                                className="dash-btn-neutral disabled:opacity-60"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr>
                                    <td className="dash-muted px-3 py-6 text-sm" colSpan={6}>
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
