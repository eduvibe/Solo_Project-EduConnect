import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ParentDashboard() {
    const user = usePage().props.auth.user;

    return (
        <DashboardLayout title="Parent Dashboard">
            <Head title="Parent Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-500">
                                    Welcome back, {user?.name}
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    Find a tutor and book your next lesson
                                </div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Search tutors by subject and location, then schedule lessons that fit your family.
                                </div>
                            </div>
                            <Link
                                href={route('tutors.index')}
                                className="inline-flex items-center justify-center bg-[#9dff52] px-5 py-3 text-base font-semibold text-black"
                            >
                                Find tutors
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Active bookings
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    2
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    This week
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Messages
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    5
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Unread
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5">
                                <div className="text-xs font-semibold text-slate-500">
                                    Spend
                                </div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    ₦28,000
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Last 30 days
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">
                                Upcoming lessons
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    { title: 'Maths • JSS2', time: 'Today • 4:30 PM', tutor: 'Amaka' },
                                    { title: 'English • WAEC', time: 'Tomorrow • 6:00 PM', tutor: 'Ibrahim' },
                                ].map((l) => (
                                    <div
                                        key={l.title}
                                        className="bg-slate-50 p-4"
                                    >
                                        <div className="text-sm font-semibold text-slate-900">
                                            {l.title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {l.time} • Tutor: {l.tutor}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">
                                Recommended next steps
                            </div>
                            <div className="mt-4 space-y-3">
                                {[
                                    'Tell us your child’s goals so we can match better tutors.',
                                    'Save favorite tutors for faster booking.',
                                    'Message tutors before booking to confirm schedules.',
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
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <Link
                                href={route('tutors.index')}
                                className="bg-slate-50 p-4 text-sm font-semibold text-slate-900"
                            >
                                Browse tutors
                            </Link>
                            <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                View bookings
                            </div>
                            <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Payments
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
