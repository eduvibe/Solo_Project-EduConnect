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

            <div className="bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Your agreements</div>
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-3 py-2">Parent</th>
                                <th className="px-3 py-2">Rate</th>
                                <th className="px-3 py-2">Sessions</th>
                                <th className="px-3 py-2">Total</th>
                                <th className="px-3 py-2">Pay day</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {agreements.map((a) => (
                                <tr key={a.id}>
                                    <td className="px-3 py-2 text-sm">{a.parent?.name || '-'}</td>
                                    <td className="px-3 py-2 text-sm">₦{(a.hourly_rate_cents/100).toLocaleString()}/hr</td>
                                    <td className="px-3 py-2 text-sm">{a.sessions_count}</td>
                                    <td className="px-3 py-2 text-sm">₦{(a.total_cents/100).toLocaleString()}</td>
                                    <td className="px-3 py-2 text-sm">{a.pay_day || '-'}</td>
                                    <td className="px-3 py-2 text-sm">{a.status}</td>
                                    <td className="px-3 py-2">
                                        {role === 'teacher' && a.status === 'pending_teacher' ? (
                                            <button
                                                type="button"
                                                onClick={() => accept(a.id)}
                                                className="text-sm font-semibold text-slate-900"
                                            >
                                                Accept
                                            </button>
                                        ) : (
                                            <span className="text-sm text-slate-500">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {agreements.length === 0 && (
                                <tr>
                                    <td className="px-3 py-6 text-base text-slate-700" colSpan={7}>
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

