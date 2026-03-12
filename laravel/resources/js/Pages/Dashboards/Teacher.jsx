import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function TeacherDashboard() {
    const user = usePage().props.auth.user;
    const upcomingSchedules = usePage().props.upcomingSchedules || [];

    return (
        <DashboardLayout title="Tutor Dashboard">
            <Head title="Tutor Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-500">
                                    Hello, {user?.name}
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    Your tutoring workspace
                                </div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Manage lessons, bookings, and student requests in one place.
                                </div>
                            </div>

                            <div className="flex h-24 w-24 items-center justify-center bg-[#9dff52] text-black">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-12 w-12"
                                >
                                    <path d="M4 19.5V5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v14" />
                                    <path d="M8 7h8" />
                                    <path d="M8 11h8" />
                                    <path d="M8 15h6" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                            <div>
                                <div className="text-xs font-semibold text-slate-500">
                                    Profile views
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    83
                                </div>
                                <div className="text-xs text-slate-500">
                                    This week
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-500">
                                    Verification
                                </div>
                                <div className="mt-2 text-sm font-semibold text-slate-900">
                                    Pending
                                </div>
                                <div className="text-xs text-slate-500">
                                    Upload docs to go live
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-500">
                                    Earnings
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    ₦125,000
                                </div>
                                <div className="text-xs text-slate-500">
                                    Last 30 days
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">
                                    Notifications
                                </div>
                                <div className="text-xs font-semibold text-slate-700">
                                    All
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    'You have a new tutoring request.',
                                    'A parent messaged you about availability.',
                                    'Complete verification to appear in search.',
                                ].map((t) => (
                                    <div
                                        key={t}
                                        className="bg-slate-50 p-4 text-sm text-slate-700"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">
                                Agreements
                            </div>
                            <div className="mt-3 text-sm text-slate-600">
                                Accept pending agreements to unlock messaging and credit earnings.
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('dashboard.agreements')}
                                    className="inline-flex bg-[#9dff52] px-5 py-3 text-base font-semibold text-black"
                                >
                                    View agreements
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-900">
                                Upcoming classes
                            </div>
                            <Link
                                href={route('dashboard.schedules')}
                                className="text-sm font-semibold text-slate-900 underline"
                            >
                                Open
                            </Link>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">When</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {upcomingSchedules.map((s) => (
                                        <tr key={s.id}>
                                            <td className="px-3 py-2 text-sm font-semibold text-slate-900">
                                                {s.title}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-slate-800">
                                                {s.recurring
                                                    ? `${String(s.day_of_week || '').toUpperCase()} ${s.start_time || ''}`
                                                    : s.date || ''}
                                            </td>
                                        </tr>
                                    ))}
                                    {upcomingSchedules.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-4 text-sm text-slate-700" colSpan={2}>
                                                No upcoming classes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <Link
                                href={route('profile.edit')}
                                className="bg-slate-50 p-4 text-sm font-semibold text-slate-900"
                            >
                                Update profile
                            </Link>
                            <Link
                                href={route('dashboard.schedules')}
                                className="bg-slate-50 p-4 text-sm font-semibold text-slate-900"
                            >
                                Manage schedules
                            </Link>
                            <Link
                                href={route('dashboard.payouts')}
                                className="bg-slate-50 p-4 text-sm font-semibold text-slate-900"
                            >
                                View payouts
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
