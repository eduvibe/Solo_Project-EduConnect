import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function SuperadminWalletFundings() {
    const payments = usePage().props.payments || [];
    const [notesById, setNotesById] = useState({});

    const approve = (id) => {
        router.post(route('dashboard.superadmin.wallet-fundings.approve', id), {}, { preserveScroll: true });
    };

    const reject = (id) => {
        router.post(
            route('dashboard.superadmin.wallet-fundings.reject', id),
            { admin_notes: notesById[id] || '' },
            { preserveScroll: true },
        );
    };

    const hasAny = useMemo(() => payments.length > 0, [payments.length]);

    return (
        <DashboardLayout title="Wallet top-ups">
            <Head title="Wallet top-ups" />

            <div className="dash-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="dash-title text-lg font-semibold">Pending wallet top-ups</div>
                        <div className="dash-muted mt-1 text-sm">Approve or reject after verifying the bank transfer.</div>
                    </div>
                    <div className="dash-title text-sm font-semibold">{payments.length} pending</div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                <th className="px-3 py-2">Parent</th>
                                <th className="px-3 py-2">Reference</th>
                                <th className="px-3 py-2">Amount</th>
                                <th className="px-3 py-2">Bank ref</th>
                                <th className="px-3 py-2">Receipt</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="dash-divider">
                            {payments.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-3 py-3">
                                        <div className="dash-title text-sm font-semibold">{p.parent?.name}</div>
                                        <div className="dash-muted text-sm">{p.parent?.email}</div>
                                    </td>
                                    <td className="dash-title px-3 py-3 text-sm font-semibold">{p.intent?.reference || '—'}</td>
                                    <td className="dash-title px-3 py-3 text-sm font-semibold">
                                        ₦{Math.floor(Number(p.amount_kobo || 0) / 100).toLocaleString()}
                                    </td>
                                    <td className="dash-muted px-3 py-3 text-sm">{p.payment_reference}</td>
                                    <td className="px-3 py-3 text-sm">
                                        {p.receipt_path ? (
                                            <a
                                                href={`/storage/${p.receipt_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="dash-link text-sm font-semibold"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="dash-muted text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button type="button" onClick={() => approve(p.id)} className="dash-btn-green">
                                                Approve
                                            </button>
                                            <button type="button" onClick={() => reject(p.id)} className="dash-btn-neutral">
                                                Reject
                                            </button>
                                            <textarea
                                                value={notesById[p.id] ?? ''}
                                                onChange={(e) => setNotesById((m) => ({ ...m, [p.id]: e.target.value }))}
                                                rows={2}
                                                className="dash-input w-72 p-2 text-sm"
                                                placeholder="Rejection reason (optional)"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!hasAny && (
                                <tr>
                                    <td className="dash-muted px-3 py-6 text-sm" colSpan={6}>
                                        No pending wallet top-ups.
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

