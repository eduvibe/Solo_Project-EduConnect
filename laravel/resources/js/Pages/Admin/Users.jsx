import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function titleFromRole(role) {
    if (role === 'teacher') return 'Teachers';
    if (role === 'parent') return 'Parents';
    if (role === 'admin') return 'Admins';
    if (role === 'superadmin') return 'Superadmins';
    return 'All Users';
}

export default function Users({ users, filters }) {
    const flash = usePage().props.flash;
    const isTeachersView = route().current('dashboard.superadmin.teachers');
    const currentRole = isTeachersView ? 'teacher' : filters?.role || '';

    const initialRoles = useMemo(() => {
        const map = {};
        for (const u of users.data) {
            map[u.id] = u.role || 'parent';
        }
        return map;
    }, [users.data]);

    const [q, setQ] = useState(filters?.q || '');
    const [rolesById, setRolesById] = useState(initialRoles);

    const submitSearch = (e) => {
        e.preventDefault();

        const target = isTeachersView
            ? route('dashboard.superadmin.teachers')
            : route('admin.users');

        router.get(
            target,
            {
                q,
                role: currentRole === '' || isTeachersView ? undefined : currentRole,
            },
            { preserveState: true, replace: true },
        );
    };

    const updateRole = (userId) => {
        const role = rolesById[userId] || 'parent';
        router.patch(
            route('admin.users.role', userId),
            { role },
            { preserveScroll: true },
        );
    };

    return (
        <DashboardLayout title="User Management">
            <Head title="User Management" />

            <div className="space-y-6">
                {flash?.status && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.status}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={route('admin.users')}
                                    className={
                                        'rounded-full px-4 py-2 text-sm font-semibold ' +
                                        (currentRole === '' && !isTeachersView
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                                    }
                                >
                                    All
                                </Link>
                                <Link
                                    href={route('dashboard.superadmin.teachers')}
                                    className={
                                        'rounded-full px-4 py-2 text-sm font-semibold ' +
                                        (currentRole === 'teacher'
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                                    }
                                >
                                    Teachers
                                </Link>
                                <Link
                                    href={route('admin.users', { role: 'parent' })}
                                    className={
                                        'rounded-full px-4 py-2 text-sm font-semibold ' +
                                        (currentRole === 'parent'
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                                    }
                                >
                                    Parents
                                </Link>
                            </div>

                            <form
                                onSubmit={submitSearch}
                                className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
                            >
                                <div className="text-sm font-semibold text-slate-900">
                                    {titleFromRole(currentRole)}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={q}
                                        onChange={(e) =>
                                            setQ(e.target.value)
                                        }
                                        placeholder="Search name or email..."
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:w-80"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {u.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={
                                                    rolesById[u.id] || 'parent'
                                                }
                                                onChange={(e) =>
                                                    setRolesById((prev) => ({
                                                        ...prev,
                                                        [u.id]: e.target.value,
                                                    }))
                                                }
                                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                            >
                                                <option value="parent">
                                                    parent
                                                </option>
                                                <option value="teacher">
                                                    teacher
                                                </option>
                                                <option value="admin">
                                                    admin
                                                </option>
                                                <option value="superadmin">
                                                    superadmin
                                                </option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {u.created_at || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => updateRole(u.id)}
                                                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.links && users.links.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                                {users.links.map((linkItem, i) => (
                                    <Link
                                        key={`${linkItem.label}-${i}`}
                                        href={linkItem.url || '#'}
                                        preserveScroll
                                        preserveState
                                        className={
                                            'rounded-md px-3 py-2 text-sm ' +
                                            (linkItem.active
                                                ? 'bg-brand-700 text-white'
                                                : linkItem.url
                                                  ? 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
                                                  : 'cursor-not-allowed bg-gray-100 text-gray-400')
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: linkItem.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
