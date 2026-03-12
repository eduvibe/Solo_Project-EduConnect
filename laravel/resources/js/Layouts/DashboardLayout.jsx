import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

function initials(name) {
    const parts = String(name || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (parts.length === 0) return 'U';
    return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');
}

function roleLabel(role) {
    const r = String(role || '').toLowerCase();
    if (r === 'teacher') return 'Tutor';
    if (r === 'parent') return 'Parent';
    if (r === 'superadmin') return 'Superadmin';
    if (r === 'admin') return 'Admin';
    return 'User';
}

export default function DashboardLayout({ title, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const impersonation = page.props.impersonation;
    const effectiveRole = String(impersonation?.activeRole || user?.role || '').toLowerCase();
    const canImpersonate = Boolean(impersonation?.can);
    const isImpersonating = Boolean(impersonation?.activeRole);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const unreadMessages = Number(page.props.counts?.unreadMessages || 0);
    const unreadNotifications = Number(page.props.counts?.unreadNotifications || 0);

    const nav = useMemo(() => {
        const role = String(effectiveRole || '').toLowerCase();

        if (role === 'superadmin') {
            return [
                { label: 'Dashboard', href: route('dashboard.superadmin'), active: route().current('dashboard.superadmin') },
                { label: 'Teachers', href: route('dashboard.superadmin.teachers'), active: route().current('dashboard.superadmin.teachers') },
                { label: 'Verifications', href: route('dashboard.superadmin.verifications'), active: route().current('dashboard.superadmin.verifications') },
                { label: 'Payouts', href: route('dashboard.superadmin.payouts'), active: route().current('dashboard.superadmin.payouts') },
                { label: 'User management', href: route('admin.users'), active: route().current('admin.users') },
                { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
            ];
        }

        if (role === 'admin') {
            return [
                { label: 'Dashboard', href: route('dashboard.admin'), active: route().current('dashboard.admin') },
                { label: 'Tutors', href: route('tutors.index'), active: route().current('tutors.index') },
                { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
            ];
        }

        if (role === 'teacher') {
            return [
                { label: 'Dashboard', href: route('dashboard.teacher'), active: route().current('dashboard.teacher') },
                { label: 'Agreements', href: route('dashboard.agreements'), active: route().current('dashboard.agreements') },
                { label: 'Payouts', href: route('dashboard.payouts'), active: route().current('dashboard.payouts') },
                { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
            ];
        }

        return [
            { label: 'Dashboard', href: route('dashboard.parent'), active: route().current('dashboard.parent') },
            { label: 'Find tutors', href: route('tutors.index'), active: route().current('tutors.index') },
            { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
        ];
    }, [effectiveRole]);

    const switchToRole = (role) => {
        router.post(route('impersonate.role'), { role }, { preserveScroll: true });
    };

    const stopImpersonation = () => {
        router.post(route('impersonate.stop'), {}, { preserveScroll: true });
    };

    useEffect(() => {
        if (!('Notification' in window)) return;
        if (unreadNotifications <= 0) return;
        if (Notification.permission !== 'granted') return;

        const key = `last_push_notif_${user?.id || 'anon'}`;
        const last = Number(window.localStorage.getItem(key) || 0);
        const now = Date.now();
        if (now - last < 60_000) return;

        const n = new Notification('EduConnect', {
            body: `You have ${unreadNotifications} unread notification${unreadNotifications === 1 ? '' : 's'}.`,
        });
        window.localStorage.setItem(key, String(now));
        n.onclick = () => {
            window.focus();
        };
    }, [user?.id, unreadNotifications]);

    const Sidebar = (
        <div className="flex h-full flex-col bg-black text-white">
            <div className="flex items-center gap-3 px-6 py-5">
                <ApplicationLogo className="h-10 w-10 text-white" />
                <div className="leading-tight">
                    <div className="text-base font-semibold">EduConnect</div>
                    <div className="text-sm text-white/70">Dashboard</div>
                </div>
            </div>

            <div className="px-6 pb-4">
                <div className="bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center bg-[#9dff52] text-base font-bold text-black">
                            {initials(user?.name)}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-base font-semibold">
                                {user?.name}
                            </div>
                            <div className="truncate text-sm text-white/70">
                                {roleLabel(effectiveRole)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="px-4">
                <div className="space-y-1">
                    {nav.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={
                                'flex items-center px-4 py-3 text-sm font-semibold ' +
                                (item.active ? 'bg-[#9dff52] text-black' : 'text-white/85')
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-auto px-6 py-5">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex w-full items-center justify-center bg-white/10 px-4 py-3 text-base font-semibold text-white"
                >
                    Log out
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-[14px] text-white">
            <div className="mx-auto flex max-w-7xl">
                <div className="hidden h-screen w-72 shrink-0 lg:block">
                    {Sidebar}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 lg:py-6">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="inline-flex items-center justify-center bg-white/10 p-3 text-white lg:hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 12h18" />
                                    <path d="M3 6h18" />
                                    <path d="M3 18h18" />
                                </svg>
                            </button>

                            <div>
                                <div className="text-xl font-semibold text-white">
                                    {title}
                                </div>
                                <div className="text-sm text-white/60">
                                    Viewing as {roleLabel(effectiveRole)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={route('dashboard.schedules')} aria-label="Schedules" className="text-white/85">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                    <rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                            </Link>
                            <Link href={route('dashboard.messages')} aria-label="Messages" className="relative text-white/85">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                {unreadMessages > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center bg-[#9dff52] px-1 text-[9px] font-bold text-black">
                                        {unreadMessages}
                                    </span>
                                )}
                            </Link>
                            <Link href={route('dashboard.notifications')} className="relative text-white/85" aria-label="Notifications" title="Notifications">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                </svg>
                                {unreadNotifications > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center bg-[#9dff52] px-1 text-[9px] font-bold text-black">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </Link>
                            {canImpersonate && (
                                <div className="hidden items-center gap-2 sm:flex">
                                    {isImpersonating ? (
                                        <button
                                            type="button"
                                            onClick={stopImpersonation}
                                            className="dash-btn-green px-4 py-3 text-base"
                                        >
                                            Back to owner
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => switchToRole('parent')}
                                                className="dash-btn-green px-4 py-3 text-base"
                                            >
                                                View as parent
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => switchToRole('teacher')}
                                                className="dash-btn-green px-4 py-3 text-base"
                                            >
                                                View as tutor
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 bg-white/10 px-4 py-3 text-base font-semibold text-white"
                                        >
                                            <span className="hidden sm:inline">
                                                {user?.name}
                                            </span>
                                            <span className="flex h-8 w-8 items-center justify-center bg-[#9dff52] text-sm font-bold text-black">
                                                {initials(user?.name)}
                                            </span>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    {canImpersonate && (
                                        <div className="border-b border-slate-200">
                                            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Role preview
                                            </div>
                                            {isImpersonating ? (
                                                <Dropdown.Link
                                                    href={route('impersonate.stop')}
                                                    method="post"
                                                    as="button"
                                                >
                                                    Back to owner
                                                </Dropdown.Link>
                                            ) : (
                                                <>
                                                    <Dropdown.Link
                                                        href={route('impersonate.role')}
                                                        method="post"
                                                        as="button"
                                                        data={{ role: 'parent' }}
                                                    >
                                                        View as parent
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route('impersonate.role')}
                                                        method="post"
                                                        as="button"
                                                        data={{ role: 'teacher' }}
                                                    >
                                                        View as tutor
                                                    </Dropdown.Link>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="px-6 pb-10">{children}</div>
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 bg-black/40"
                    />
                    <div className="relative h-full w-72">
                        <div className="absolute right-0 top-0 p-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="bg-white/10 p-2 text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M18 6L6 18" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {Sidebar}
                    </div>
                </div>
            )}
        </div>
    );
}
