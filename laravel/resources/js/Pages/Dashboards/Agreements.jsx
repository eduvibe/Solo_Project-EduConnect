import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';

export default function Agreements() {
    const agreements = usePage().props.agreements || [];
    const role = (usePage().props.role || '').toLowerCase();

    const accept = (id) => {
        router.post(route('agreements.accept', id), {}, { preserveScroll: true });
    };

    return (
        <DashboardLayout title="Agreements">
            <Head title="Agreements" />

            <div className="dash-surface p-6">
                <div className="text-sm font-semibold text-white">Your agreements</div>
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                <th className="px-3 py-2">Parent</th>
                                <th className="px-3 py-2">Rate</th>
                                <th className="px-3 py-2">Sessions</th>
                                <th className="px-3 py-2">Total</th>
                                <th className="px-3 py-2">Pay day</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="dash-divider">
                            {agreements.map((a) => (
                                <tr key={a.id}>
                                    <td className="px-3 py-2 text-sm text-white/80">{a.parent?.name || '-'}</td>
                                    <td className="px-3 py-2 text-sm text-white/80">₦{(a.hourly_rate_cents/100).toLocaleString()}/hr</td>
                                    <td className="px-3 py-2 text-sm text-white/80">{a.sessions_count}</td>
                                    <td className="px-3 py-2 text-sm text-white/80">₦{(a.total_cents/100).toLocaleString()}</td>
                                    <td className="px-3 py-2 text-sm text-white/80">{a.pay_day || '-'}</td>
                                    <td className="px-3 py-2 text-sm text-white/70">{a.status}</td>
                                    <td className="px-3 py-2">
                                        {role === 'teacher' && a.status === 'pending_teacher' ? (
                                            <button
                                                type="button"
                                                onClick={() => accept(a.id)}
                                                className="dash-btn-green"
                                            >
                                                Accept
                                            </button>
                                        ) : (
                                            <span className="text-sm text-white/60">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {agreements.length === 0 && (
                                <tr>
                                    <td className="px-3 py-6 text-sm text-white/70" colSpan={7}>
                                        No agreements yet.
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
