import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';

export default function TeacherDashboard() {
    const user = usePage().props.auth.user;

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

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Profile views
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    83
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    This week
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Verification
                                </div>
                                <div className="mt-2 text-sm font-semibold text-slate-900">
                                    Pending
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Upload docs to go live
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Earnings
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    ₦125,000
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
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
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">
                                    Upcoming schedule
                                </div>
                                <div className="text-xs font-semibold text-slate-700">
                                    Next
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    { title: 'Maths - JSS2', time: 'Today • 4:30 PM', mode: 'Online' },
                                    { title: 'English - WAEC', time: 'Tomorrow • 6:00 PM', mode: 'In-person' },
                                    { title: 'Physics - SSS3', time: 'Sat • 10:00 AM', mode: 'Online' },
                                ].map((s) => (
                                    <div
                                        key={s.title}
                                        className="bg-slate-50 p-4"
                                    >
                                        <div className="text-sm font-semibold text-slate-900">
                                            {s.title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {s.time} • {s.mode}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Profile strength
                        </div>
                        <div className="mt-3 bg-slate-50 p-4">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <div>Completed</div>
                                <div className="font-semibold text-slate-900">
                                    23%
                                </div>
                            </div>
                            <div className="mt-3 h-2 w-full bg-slate-200">
                                <div className="h-2 w-[23%] bg-[#9dff52]"></div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm text-slate-700">
                                <div className="flex items-start gap-2">
                                    <span className="mt-1 h-2 w-2 bg-[#9dff52]"></span>
                                    Add subjects & pricing
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-1 h-2 w-2 bg-[#9dff52]"></span>
                                    Upload verification documents
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-1 h-2 w-2 bg-[#9dff52]"></span>
                                    Set availability
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Update profile
                            </div>
                            <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Add availability
                            </div>
                            <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                View payouts
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
