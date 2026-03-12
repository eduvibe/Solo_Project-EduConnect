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
                                <div className="dash-muted-strong text-sm font-semibold">
                                    Hello, {user?.name}
                                </div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    Platform overview
                                </div>
                                <div className="dash-muted mt-2 text-sm">
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
                            <div className="dash-surface p-5">
                                <div className="dash-muted text-xs font-semibold">
                                    New signups
                                </div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    12
                                </div>
                                <div className="dash-muted mt-1 text-xs">
                                    Today
                                </div>
                            </div>
                            <div className="dash-surface p-5">
                                <div className="dash-muted text-xs font-semibold">
                                    Active tutors
                                </div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    84
                                </div>
                                <div className="dash-muted mt-1 text-xs">
                                    This week
                                </div>
                            </div>
                            <div className="dash-surface p-5">
                                <div className="dash-muted text-xs font-semibold">
                                    Disputes
                                </div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    1
                                </div>
                                <div className="dash-muted mt-1 text-xs">
                                    Open
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="dash-surface p-6">
                            <div className="dash-title text-sm font-semibold">
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
                                        className="dash-surface dash-muted p-4 text-sm"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dash-surface p-6">
                            <div className="dash-title text-sm font-semibold">
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
                                        className="dash-surface flex items-center justify-between p-4 text-sm"
                                    >
                                        <div className="dash-muted-strong font-semibold">
                                            {i.label}
                                        </div>
                                        <div className="dash-title font-semibold">
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
                        <div className="dash-title text-sm font-semibold">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Review reports
                            </div>
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Verification queue
                            </div>
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
