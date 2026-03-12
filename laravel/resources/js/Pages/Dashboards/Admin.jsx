import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const user = usePage().props.auth.user;

    return (
        <DashboardLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-white/70">
                                    Hello, {user?.name}
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    Platform overview
                                </div>
                                <div className="mt-2 text-sm text-white/60">
                                    Review tutor activity and keep the marketplace healthy.
                                </div>
                            </div>
                            <Link
                                href={route('tutors.index')}
                                className="dash-btn-green inline-flex items-center justify-center px-5 py-3 text-base"
                            >
                                Browse tutors
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="border border-white/10 bg-black p-5">
                                <div className="text-xs font-semibold text-white/60">
                                    New signups
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    12
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    Today
                                </div>
                            </div>
                            <div className="border border-white/10 bg-black p-5">
                                <div className="text-xs font-semibold text-white/60">
                                    Active tutors
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    84
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    This week
                                </div>
                            </div>
                            <div className="border border-white/10 bg-black p-5">
                                <div className="text-xs font-semibold text-white/60">
                                    Disputes
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    1
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    Open
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="dash-surface p-6">
                            <div className="text-sm font-semibold text-white">
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
                                        className="border border-white/10 bg-black p-4 text-sm text-white/70"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dash-surface p-6">
                            <div className="text-sm font-semibold text-white">
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
                                        className="flex items-center justify-between border border-white/10 bg-black p-4 text-sm"
                                    >
                                        <div className="font-semibold text-white/70">
                                            {i.label}
                                        </div>
                                        <div className="font-semibold text-white">
                                            {i.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="text-sm font-semibold text-white">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Review reports
                            </div>
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Verification queue
                            </div>
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
