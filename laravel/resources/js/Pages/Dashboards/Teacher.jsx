import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function Donut({ items }) {
    const total = items.reduce((sum, i) => sum + Number(i.value || 0), 0);
    const r = 34;
    const c = 2 * Math.PI * r;
    let offset = 0;

    return (
        <svg width="120" height="120" viewBox="0 0 120 120">
            <g transform="translate(60,60) rotate(-90)">
                <circle r={r} cx="0" cy="0" fill="transparent" stroke="var(--dash-border)" strokeWidth="12" />
                {items.map((it) => {
                    const v = total === 0 ? 0 : Number(it.value || 0) / total;
                    const len = Math.max(0, v * c);
                    const dash = `${len} ${c - len}`;
                    const seg = (
                        <circle
                            key={it.label}
                            r={r}
                            cx="0"
                            cy="0"
                            fill="transparent"
                            stroke={it.color}
                            strokeWidth="12"
                            strokeDasharray={dash}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                        />
                    );
                    offset += len;
                    return seg;
                })}
            </g>
            <circle cx="60" cy="60" r="22" fill="var(--dash-surface)" />
            <text x="60" y="58" textAnchor="middle" fill="var(--dash-text)" className="text-[12px] font-semibold">
                {total}
            </text>
            <text x="60" y="74" textAnchor="middle" fill="var(--dash-muted)" className="text-[10px] font-semibold">
                events
            </text>
        </svg>
    );
}

export default function TeacherDashboard() {
    const user = usePage().props.auth.user;
    const upcomingSchedules = usePage().props.upcomingSchedules || [];
    const pendingAgreements = Number(usePage().props.pendingAgreements || 0);
    const balanceCents = Number(usePage().props.balanceCents || 0);
    const activity = usePage().props.activity || {};
    const nextStep = usePage().props.nextStep;

    return (
        <DashboardLayout title="Tutor Dashboard">
            <Head title="Tutor Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="dash-muted-strong text-sm font-semibold">
                                    Hello, {user?.name}
                                </div>
                                <div className="dash-title mt-2 text-lg font-semibold">
                                    Overview
                                </div>
                                <div className="dash-muted mt-2 text-sm">
                                    Keep an eye on activity, agreements, and payouts.
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                            <div>
                                <div className="dash-muted text-xs font-semibold">
                                    Profile views
                                </div>
                                <div className="dash-title mt-2 text-lg font-bold">
                                    83
                                </div>
                                <div className="dash-muted text-xs">
                                    This week
                                </div>
                            </div>
                            <div>
                                <div className="dash-muted text-xs font-semibold">
                                    Pending agreements
                                </div>
                                <div className="dash-title mt-2 text-lg font-bold">
                                    {pendingAgreements}
                                </div>
                                <div className="dash-muted text-xs">
                                    Needs your review
                                </div>
                            </div>
                            <div>
                                <div className="dash-muted text-xs font-semibold">
                                    Balance
                                </div>
                                <div className="dash-title mt-2 text-lg font-bold">
                                    ₦{(balanceCents / 100).toLocaleString()}
                                </div>
                                <div className="dash-muted text-xs">
                                    Available to payout
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="dash-surface p-6">
                            <div className="flex items-center justify-between">
                                <div className="dash-title text-sm font-semibold">
                                    Weekly activity
                                </div>
                                <Link
                                    href={route('dashboard.messages')}
                                    className="dash-link text-sm font-semibold"
                                >
                                    Messages
                                </Link>
                            </div>
                            <div className="mt-5 flex items-center gap-6">
                                <Donut
                                    items={[
                                        {
                                            label: 'Schedules',
                                            value: Number(activity.schedules || 0),
                                            color: '#9dff52',
                                        },
                                        {
                                            label: 'Messages',
                                            value: Number(activity.messages || 0),
                                            color: 'var(--dash-text)',
                                        },
                                        {
                                            label: 'Pending',
                                            value: Number(activity.agreements_pending || 0),
                                            color: '#94a3b8',
                                        },
                                    ]}
                                />
                                <div className="dash-muted-strong space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 bg-[#9dff52]" />
                                            <span>Schedules</span>
                                        </div>
                                        <div className="dash-title font-semibold">
                                            {Number(activity.schedules || 0)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5" style={{ background: 'var(--dash-text)' }} />
                                            <span>Messages</span>
                                        </div>
                                        <div className="dash-title font-semibold">
                                            {Number(activity.messages || 0)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5" style={{ background: 'var(--dash-table-head)' }} />
                                            <span>Pending</span>
                                        </div>
                                        <div className="dash-title font-semibold">
                                            {Number(activity.agreements_pending || 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dash-surface p-6">
                            <div className="flex items-center justify-between">
                                <div className="dash-title text-sm font-semibold">
                                    Next step
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    className="dash-link text-sm font-semibold"
                                >
                                    Profile
                                </Link>
                            </div>
                            {nextStep ? (
                                <div className="mt-4">
                                    <div className="dash-title text-base font-semibold">
                                        {nextStep.title}
                                    </div>
                                    <div className="dash-muted mt-2 text-sm">
                                        {nextStep.detail}
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={nextStep.href}
                                            className="dash-btn-green inline-flex"
                                        >
                                            {nextStep.action}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="dash-muted mt-4 text-sm">
                                    You’re all set. Keep your schedule updated and respond to messages quickly.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="flex items-center justify-between">
                            <div className="dash-title text-sm font-semibold">
                                Upcoming classes
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`${route('dashboard.schedules')}?create=1`}
                                    className="dash-link text-sm font-semibold"
                                >
                                    Create
                                </Link>
                                <Link
                                    href={route('dashboard.schedules')}
                                    className="dash-link text-sm font-semibold"
                                >
                                    Open
                                </Link>
                            </div>
                        </div>


                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">When</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {upcomingSchedules.map((s) => (
                                        <tr key={s.id}>
                                            <td className="dash-title px-3 py-2 text-sm font-semibold">
                                                {s.title}
                                            </td>
                                            <td className="dash-muted px-3 py-2 text-sm">
                                                {s.recurring
                                                    ? `${String(s.day_of_week || '').toUpperCase()} ${s.start_time || ''}`
                                                    : s.date || ''}
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
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
