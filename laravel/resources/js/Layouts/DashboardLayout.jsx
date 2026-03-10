import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const nav = useMemo(() => {
        const role = String(user?.role || '').toLowerCase();

        if (role === 'superadmin') {
            return [
                { label: 'Dashboard', href: route('dashboard.superadmin'), active: route().current('dashboard.superadmin') },
                { label: 'Teachers', href: route('dashboard.superadmin.teachers'), active: route().current('dashboard.superadmin.teachers') },
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
                { label: 'Find parents', href: route('tutors.index'), active: route().current('tutors.index') },
                { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
            ];
        }

        return [
            { label: 'Dashboard', href: route('dashboard.parent'), active: route().current('dashboard.parent') },
            { label: 'Find tutors', href: route('tutors.index'), active: route().current('tutors.index') },
            { label: 'Profile', href: route('profile.edit'), active: route().current('profile.edit') },
        ];
    }, [user?.role]);

    const Sidebar = (
        <div className="flex h-full flex-col bg-brand-800 text-white">
            <div className="flex items-center gap-3 px-6 py-5">
                <ApplicationLogo className="h-10 w-10 text-white" />
                <div className="leading-tight">
                    <div className="text-sm font-semibold">EduConnect</div>
                    <div className="text-xs text-white/70">Dashboard</div>
                </div>
            </div>

            <div className="px-6 pb-4">
                <div className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-sm font-bold">
                            {initials(user?.name)}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                                {user?.name}
                            </div>
                            <div className="truncate text-xs text-white/70">
                                {roleLabel(user?.role)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-white/70">
                            <div>Profile Completed</div>
                            <div>23%</div>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-white/15">
                            <div className="h-2 w-[23%] rounded-full bg-white"></div>
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
                                'flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ' +
                                (item.active ? 'bg-white text-brand-800' : 'text-white/90 hover:bg-white/10')
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
                    className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
                >
                    Log out
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex max-w-7xl">
                <div className="hidden h-screen w-72 shrink-0 lg:block">
                    {Sidebar}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between px-6 py-5 lg:py-6">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
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
                                <div className="text-xl font-semibold text-slate-900">
                                    {title}
                                </div>
                                <div className="text-sm text-slate-500">
                                    Hello, {user?.name}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-xl">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                        >
                                            <span className="hidden sm:inline">
                                                {user?.name}
                                            </span>
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                                                {initials(user?.name)}
                                            </span>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
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
                                className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/15"
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
