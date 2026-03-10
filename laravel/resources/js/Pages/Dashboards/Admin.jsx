import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const user = usePage().props.auth.user;

    return (
        <DashboardLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-500">
                                    Hello, {user?.name}
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    Platform overview
                                </div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Review tutor activity and keep the marketplace healthy.
                                </div>
                            </div>
                            <Link
                                href={route('tutors.index')}
                                className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                            >
                                Browse tutors
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    New signups
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    12
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Today
                                </div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Active tutors
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    84
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    This week
                                </div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Disputes
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    1
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Open
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">
                                Review queue
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    'Tutor verification documents pending.',
                                    'Reported message needs review.',
                                    'Profile flagged for duplicate content.',
                                ].map((t) => (
                                    <div
                                        key={t}
                                        className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">
                                Payments snapshot
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    { label: 'Volume', value: '₦540,000' },
                                    { label: 'Payouts', value: '₦410,000' },
                                    { label: 'Pending', value: '₦130,000' },
                                ].map((i) => (
                                    <div
                                        key={i.label}
                                        className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm"
                                    >
                                        <div className="font-semibold text-slate-700">
                                            {i.label}
                                        </div>
                                        <div className="font-semibold text-slate-900">
                                            {i.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Review reports
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Verification queue
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
