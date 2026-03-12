import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ParentDashboard() {
    const user = usePage().props.auth.user;
    const upcomingSchedules = usePage().props.upcomingSchedules || [];
    const spentCents = Number(user?.spent_cents || 0);
    const [confirmForm, setConfirmForm] = useState({
        teacher_email: '',
        hourly_rate: '',
        sessions: 4,
        pay_day: 'Friday',
    });

    const confirmBooking = (e) => {
        e.preventDefault();
        router.post(route('bookings.confirm'), confirmForm, { preserveScroll: true });
    };

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

                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                            <div>
                                <div className="text-xs font-semibold text-slate-500">Active bookings</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">2</div>
                                <div className="text-xs text-slate-500">This week</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-500">Messages</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">5</div>
                                <div className="text-xs text-slate-500">Unread</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-500">Spend</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    ₦{(spentCents / 100).toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-500">Last 30 days</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">Upcoming lessons</div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="px-3 py-2">Lesson</th>
                                            <th className="px-3 py-2">When</th>
                                            <th className="px-3 py-2">Tutor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {[
                                            { title: 'Maths • JSS2', time: 'Today • 4:30 PM', tutor: 'Amaka' },
                                            { title: 'English • WAEC', time: 'Tomorrow • 6:00 PM', tutor: 'Ibrahim' },
                                        ].map((l) => (
                                            <tr key={l.title}>
                                                <td className="px-3 py-2 text-sm font-semibold text-slate-900">{l.title}</td>
                                                <td className="px-3 py-2 text-sm text-slate-800">{l.time}</td>
                                                <td className="px-3 py-2 text-sm text-slate-800">{l.tutor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">Next steps</div>
                            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                                <li>Tell us your child’s goals so we can match better tutors.</li>
                                <li>Save favorite tutors for faster booking.</li>
                                <li>Message tutors before booking to confirm schedules.</li>
                            </ul>
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

                    <div className="mt-6 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Upcoming classes
                        </div>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">Link</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {upcomingSchedules.map((s) => (
                                        <tr key={s.id}>
                                            <td className="px-3 py-2 text-sm font-semibold text-slate-900">
                                                {s.title}
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                {s.link ? (
                                                    <a href={s.link} className="text-black underline">
                                                        Attend
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-500">—</span>
                                                )}
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
                        <div className="mt-4">
                            <Link
                                href={route('dashboard.schedules')}
                                className="text-sm font-semibold text-slate-900 underline"
                            >
                                View all schedules
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Confirm booking
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                            Confirm terms and pay to the platform. Tutor must accept before earnings are credited.
                        </div>

                        <form onSubmit={confirmBooking} className="mt-4 space-y-3">
                            <div>
                                <div className="text-sm text-slate-600">Tutor email</div>
                                <input
                                    value={confirmForm.teacher_email}
                                    onChange={(e) =>
                                        setConfirmForm((p) => ({
                                            ...p,
                                            teacher_email: e.target.value,
                                        }))
                                    }
                                    placeholder="tutor@example.com"
                                    className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-sm text-slate-600">Rate (₦/hr)</div>
                                    <input
                                        value={confirmForm.hourly_rate}
                                        onChange={(e) =>
                                            setConfirmForm((p) => ({
                                                ...p,
                                                hourly_rate: e.target.value,
                                            }))
                                        }
                                        inputMode="numeric"
                                        className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-600">Sessions</div>
                                    <input
                                        value={confirmForm.sessions}
                                        onChange={(e) =>
                                            setConfirmForm((p) => ({
                                                ...p,
                                                sessions: Number(e.target.value),
                                            }))
                                        }
                                        type="number"
                                        min={1}
                                        className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Pay day</div>
                                <select
                                    value={confirmForm.pay_day}
                                    onChange={(e) =>
                                        setConfirmForm((p) => ({
                                            ...p,
                                            pay_day: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                >
                                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-sm text-slate-600">
                                Platform service fee: 10% (deducted from tutor earnings).
                            </div>

                            <button
                                type="submit"
                                className="bg-[#9dff52] px-5 py-3 text-base font-semibold text-black"
                            >
                                Confirm & Pay
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
