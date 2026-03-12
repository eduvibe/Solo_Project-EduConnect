import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Schedules() {
    const role = (usePage().props.impersonation?.activeRole || usePage().props.role || '').toLowerCase();
    const initial = usePage().props.schedules || [];
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState({
        title: '',
        link: '',
        day_of_week: '',
        start_time: '',
        recurring: false,
        date: '',
        invite_email: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '', link: '', day_of_week: '', start_time: '', recurring: false, date: '',
    });

    useEffect(() => {
        if (role !== 'teacher') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === '1') setCreateOpen(true);
    }, [role]);

    const create = (e) => {
        e.preventDefault();
        router.post(route('schedules.store'), form, { preserveScroll: true });
        setForm({
            title: '',
            link: '',
            day_of_week: '',
            start_time: '',
            recurring: false,
            date: '',
            invite_email: '',
        });
        setCreateOpen(false);
    };

    const deleteSchedule = (id) => {
        router.delete(route('schedules.destroy', id), { preserveScroll: true });
    };

    const completeSchedule = (id) => {
        router.post(route('schedules.complete', id), {}, { preserveScroll: true });
    };

    const startEdit = (s) => {
        setEditingId(s.id);
        setEditForm({
            title: s.title || '',
            link: s.link || '',
            day_of_week: s.day_of_week || '',
            start_time: s.start_time || '',
            recurring: Boolean(s.recurring),
            date: s.date || '',
        });
    };

    const saveEdit = (id) => {
        router.patch(route('schedules.update', id), editForm, { preserveScroll: true });
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };
    const days = useMemo(() => ['mon','tue','wed','thu','fri','sat','sun'], []);

    return (
        <DashboardLayout title="Class schedules">
            <Head title="Class schedules" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-12">
                    <div className="dash-surface p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold text-white">Class schedules</div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-white/60">
                                    {role === 'teacher' ? 'Manage sessions' : 'Your sessions'}
                                </div>
                                {role === 'teacher' && (
                                    <button
                                        type="button"
                                        onClick={() => setCreateOpen(true)}
                                        className="dash-btn-green"
                                    >
                                        Create schedule
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">When</th>
                                        <th className="px-3 py-2">Recurring</th>
                                        <th className="px-3 py-2">Link</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {initial.map((s) => {
                                        const isEditing = editingId === s.id;
                                        return (
                                            <tr key={s.id}>
                                                <td className="px-3 py-2 text-sm font-semibold text-white">
                                                    {isEditing ? (
                                                        <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full border border-white/10 bg-black p-2 text-sm text-white shadow-sm" />
                                                    ) : (
                                                        s.title
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-white/70">
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <select value={editForm.day_of_week} onChange={(e) => setEditForm({ ...editForm, day_of_week: e.target.value })} className="border border-white/10 bg-black p-2 text-sm text-white shadow-sm">
                                                                <option value="">One-off</option>
                                                                {days.map((d) => (<option key={d} value={d}>{d.toUpperCase()}</option>))}
                                                            </select>
                                                            <input type="time" value={editForm.start_time} onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })} className="border border-white/10 bg-black p-2 text-sm text-white shadow-sm" />
                                                            <label className="ml-2 flex items-center gap-1 text-xs">
                                                                <input type="checkbox" checked={editForm.recurring} onChange={(e) => setEditForm({ ...editForm, recurring: e.target.checked })} />
                                                                Recurring
                                                            </label>
                                                            <input type="date" value={editForm.date || ''} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="border border-white/10 bg-black p-2 text-sm text-white shadow-sm" />
                                                        </div>
                                                    ) : (
                                                        s.recurring ? `${(s.day_of_week || '').toUpperCase()} ${s.start_time || ''}` : (s.date || '')
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-white/70">
                                                    {isEditing ? (editForm.recurring ? 'Yes' : 'No') : (s.recurring ? 'Yes' : 'No')}
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    {isEditing ? (
                                                        <input value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} className="w-full border border-white/10 bg-black p-2 text-sm text-white shadow-sm" />
                                                    ) : (
                                                        s.link ? (<Link href={s.link} className="dash-link text-sm font-semibold">Open</Link>) : '-'
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-white/70">{s.status}</td>
                                                <td className="px-3 py-2">
                                                    {role === 'teacher' ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <button type="button" onClick={() => saveEdit(s.id)} className="text-sm font-semibold text-white underline">Save</button>
                                                                    <button type="button" onClick={cancelEdit} className="text-sm text-white/70">Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button type="button" onClick={() => startEdit(s)} className="text-sm font-semibold text-white underline">Edit</button>
                                                                    <button type="button" onClick={() => completeSchedule(s.id)} className="text-sm font-semibold text-white underline">Complete</button>
                                                                    <button type="button" onClick={() => deleteSchedule(s.id)} className="text-sm font-semibold text-white underline">Delete</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        s.link ? (
                                                            <Link href={s.link} className="dash-link text-sm font-semibold">Attend</Link>
                                                        ) : (
                                                            <span className="text-sm text-white/60">—</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {initial.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-sm text-white/70" colSpan={6}>
                                                No schedules yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {createOpen && role === 'teacher' && (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setCreateOpen(false)}
                    />
                    <div className="dash-surface absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-white">Create schedule</div>
                            <button
                                type="button"
                                className="text-sm font-semibold text-white/70"
                                onClick={() => setCreateOpen(false)}
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={create} className="mt-5 grid gap-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <div className="text-sm text-white/70">Title</div>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <div className="text-sm text-white/70">Class link</div>
                                <input
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-sm text-white/70">Day</div>
                                <select
                                    value={form.day_of_week}
                                    onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                >
                                    <option value="">One-off</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>
                                            {d.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-sm text-white/70">Start time</div>
                                <input
                                    type="time"
                                    value={form.start_time}
                                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-sm text-white/70">Date</div>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <label className="flex items-center gap-2 text-sm text-white/80">
                                    <input
                                        type="checkbox"
                                        checked={form.recurring}
                                        onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
                                    />
                                    Recurring weekly
                                </label>
                            </div>
                            <div className="sm:col-span-6">
                                <div className="text-sm text-white/70">Invite parent (email)</div>
                                <input
                                    value={form.invite_email}
                                    onChange={(e) => setForm({ ...form, invite_email: e.target.value })}
                                    className="mt-1 w-full border border-white/10 bg-black p-3 text-sm text-white shadow-sm"
                                />
                            </div>
                            <div className="sm:col-span-6 flex gap-3">
                                <button type="submit" className="dash-btn-green">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="px-5 py-2 text-sm font-semibold text-white/70"
                                    onClick={() => setCreateOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
