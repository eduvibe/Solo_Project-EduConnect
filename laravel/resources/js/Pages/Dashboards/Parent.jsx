import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ParentDashboard() {
    const user = usePage().props.auth.user;
    const upcomingSchedules = usePage().props.upcomingSchedules || [];
    const spentCents = Number(user?.spent_cents || 0);
    const walletKobo = Number(user?.wallet_balance_kobo || 0);

    return (
        <DashboardLayout title="Parent Dashboard">
            <Head title="Parent Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="dash-muted-strong text-sm font-semibold">
                                    Welcome back, {user?.name}
                                </div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    Find a tutor and book your next lesson
                                </div>
                                <div className="dash-muted mt-2 text-sm">
                                    Search tutors by subject and location, then schedule lessons that fit your family.
                                </div>
                            </div>
                            <Link
                                href={route('tutors.index')}
                                className="dash-btn-green inline-flex items-center justify-center px-5 py-3 text-base"
                            >
                                Find tutors
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                            <div>
                                <div className="dash-muted text-xs font-semibold">Active bookings</div>
                                <div className="dash-title mt-2 text-2xl font-bold">2</div>
                                <div className="dash-muted text-xs">This week</div>
                            </div>
                            <div>
                                <div className="dash-muted text-xs font-semibold">Messages</div>
                                <div className="dash-title mt-2 text-2xl font-bold">5</div>
                                <div className="dash-muted text-xs">Unread</div>
                            </div>
                            <div>
                                <div className="dash-muted text-xs font-semibold">Spend</div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    ₦{(spentCents / 100).toLocaleString()}
                                </div>
                                <div className="dash-muted text-xs">Last 30 days</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="dash-surface p-6">
                            <div className="dash-title text-sm font-semibold">Upcoming lessons</div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-3 py-2">Lesson</th>
                                            <th className="px-3 py-2">When</th>
                                            <th className="px-3 py-2">Tutor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dash-divider">
                                        {[
                                            { title: 'Maths • JSS2', time: 'Today • 4:30 PM', tutor: 'Amaka' },
                                            { title: 'English • WAEC', time: 'Tomorrow • 6:00 PM', tutor: 'Ibrahim' },
                                        ].map((l) => (
                                            <tr key={l.title}>
                                                <td className="dash-title px-3 py-2 text-sm font-semibold">{l.title}</td>
                                                <td className="dash-muted px-3 py-2 text-sm">{l.time}</td>
                                                <td className="dash-muted px-3 py-2 text-sm">{l.tutor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="dash-surface p-6">
                            <div className="dash-title text-sm font-semibold">Next steps</div>
                            <ul className="dash-muted mt-4 list-disc space-y-2 pl-5 text-sm">
                                <li>Tell us your child’s goals so we can match better tutors.</li>
                                <li>Save favorite tutors for faster booking.</li>
                                <li>Message tutors before booking to confirm schedules.</li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-muted-strong text-sm font-semibold">Wallet balance</div>
                        <div className="dash-title mt-2 text-3xl font-bold">
                            ₦{Math.floor(walletKobo / 100).toLocaleString()}
                        </div>
                        <div className="mt-4">
                            <Link href={route('dashboard.wallet')} className="dash-btn-green inline-flex px-5 py-3 text-base">
                                View wallet
                            </Link>
                        </div>
                    </div>

                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">
                            Upcoming classes
                        </div>
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">Link</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {upcomingSchedules.map((s) => (
                                        <tr key={s.id}>
                                            <td className="dash-title px-3 py-2 text-sm font-semibold">
                                                {s.title}
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                {s.link ? (
                                                    <a href={s.link} className="dash-link text-sm font-semibold">
                                                        Attend
                                                    </a>
                                                ) : (
                                                    <span className="dash-muted text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {upcomingSchedules.length === 0 && (
                                        <tr>
                                            <td className="dash-muted px-3 py-4 text-sm" colSpan={2}>
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
                                className="dash-link text-sm font-semibold"
                            >
                                View all schedules
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
