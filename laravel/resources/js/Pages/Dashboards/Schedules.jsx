import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Schedules() {
    const role = (usePage().props.role || '').toLowerCase();
    const initial = usePage().props.schedules || [];
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '', link: '', day_of_week: '', start_time: '', recurring: false, date: '',
    });

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
                    <div className="bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold text-slate-900">Class schedules</div>
                            <div className="text-sm text-slate-500">
                                {role === 'teacher' ? 'Manage sessions' : 'Your sessions'}
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="px-3 py-2">Title</th>
                                        <th className="px-3 py-2">When</th>
                                        <th className="px-3 py-2">Recurring</th>
                                        <th className="px-3 py-2">Link</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {initial.map((s) => {
                                        const isEditing = editingId === s.id;
                                        return (
                                            <tr key={s.id}>
                                                <td className="px-3 py-2 text-sm font-semibold text-slate-900">
                                                    {isEditing ? (
                                                        <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full border-slate-300 text-sm shadow-sm" />
                                                    ) : (
                                                        s.title
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-slate-800">
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <select value={editForm.day_of_week} onChange={(e) => setEditForm({ ...editForm, day_of_week: e.target.value })} className="border-slate-300 text-sm shadow-sm">
                                                                <option value="">One-off</option>
                                                                {days.map((d) => (<option key={d} value={d}>{d.toUpperCase()}</option>))}
                                                            </select>
                                                            <input type="time" value={editForm.start_time} onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })} className="border-slate-300 text-sm shadow-sm" />
                                                            <label className="ml-2 flex items-center gap-1 text-xs">
                                                                <input type="checkbox" checked={editForm.recurring} onChange={(e) => setEditForm({ ...editForm, recurring: e.target.checked })} />
                                                                Recurring
                                                            </label>
                                                            <input type="date" value={editForm.date || ''} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="border-slate-300 text-sm shadow-sm" />
                                                        </div>
                                                    ) : (
                                                        s.recurring ? `${(s.day_of_week || '').toUpperCase()} ${s.start_time || ''}` : (s.date || '')
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-slate-800">
                                                    {isEditing ? (editForm.recurring ? 'Yes' : 'No') : (s.recurring ? 'Yes' : 'No')}
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    {isEditing ? (
                                                        <input value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} className="w-full border-slate-300 text-sm shadow-sm" />
                                                    ) : (
                                                        s.link ? (<Link href={s.link} className="text-black underline">Open</Link>) : '-'
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-slate-800">{s.status}</td>
                                                <td className="px-3 py-2">
                                                    {role === 'teacher' ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <button type="button" onClick={() => saveEdit(s.id)} className="text-sm font-semibold text-slate-900">Save</button>
                                                                    <button type="button" onClick={cancelEdit} className="text-sm text-slate-700">Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button type="button" onClick={() => startEdit(s)} className="text-sm font-semibold text-slate-900">Edit</button>
                                                                    <button type="button" onClick={() => completeSchedule(s.id)} className="text-sm font-semibold text-slate-900">Complete</button>
                                                                    <button type="button" onClick={() => deleteSchedule(s.id)} className="text-sm font-semibold text-slate-900">Delete</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        s.link ? (
                                                            <Link href={s.link} className="text-sm font-semibold text-slate-900">Attend</Link>
                                                        ) : (
                                                            <span className="text-sm text-slate-500">—</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {initial.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-sm text-slate-700" colSpan={6}>
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
        </DashboardLayout>
    );
}
