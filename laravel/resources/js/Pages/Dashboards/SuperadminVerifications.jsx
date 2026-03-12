import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function SuperadminVerifications() {
    const teachers = usePage().props.teachers || [];
    const [notesById, setNotesById] = useState({});

    const approve = (id) => {
        router.post(route('dashboard.superadmin.verifications.approve', id), {}, { preserveScroll: true });
    };

    const reject = (id) => {
        const note = (notesById[id] || '').trim();
        router.post(
            route('dashboard.superadmin.verifications.reject', id),
            { note },
            { preserveScroll: true },
        );
    };

    const canReject = useMemo(() => {
        const map = {};
        for (const t of teachers) {
            map[t.id] = String(notesById[t.id] || '').trim().length > 0;
        }
        return map;
    }, [notesById, teachers]);

    return (
        <DashboardLayout title="Tutor verification">
            <Head title="Tutor verification" />

            <div className="dash-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="dash-title text-lg font-semibold">Pending reviews</div>
                        <div className="dash-muted mt-1 text-sm">
                            Review uploaded documents and approve or reject with a note.
                        </div>
                    </div>
                    <div className="dash-title text-sm font-semibold">
                        {teachers.length} pending
                    </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                <th className="px-3 py-2">Tutor</th>
                                <th className="px-3 py-2">Submitted</th>
                                <th className="px-3 py-2">Files</th>
                                <th className="px-3 py-2">Reject note</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="dash-divider">
                            {teachers.map((t) => (
                                <tr key={t.id}>
                                    <td className="px-3 py-3">
                                        <div className="dash-title text-sm font-semibold">{t.name}</div>
                                        <div className="dash-muted text-sm">{t.email}</div>
                                        <div className="dash-muted text-xs">{t.phone || ''}</div>
                                    </td>
                                    <td className="dash-muted px-3 py-3 text-sm">
                                        {t.verification_submitted_at || '—'}
                                    </td>
                                    <td className="px-3 py-3 text-sm">
                                        <div className="flex flex-col gap-1">
                                            {t.avatar_path && (
                                                <a href={`/storage/${t.avatar_path}`} className="text-black underline">
                                                    Photo
                                                </a>
                                            )}
                                            {t.id_document_path && (
                                                <a href={`/storage/${t.id_document_path}`} className="text-black underline">
                                                    ID
                                                </a>
                                            )}
                                            {t.certificate_path && (
                                                <a href={`/storage/${t.certificate_path}`} className="text-black underline">
                                                    Certificate
                                                </a>
                                            )}
                                            {!t.avatar_path && !t.id_document_path && !t.certificate_path && (
                                                <span className="dash-muted text-sm">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <textarea
                                            value={notesById[t.id] ?? t.verification_rejection_note ?? ''}
                                            onChange={(e) =>
                                                setNotesById((p) => ({ ...p, [t.id]: e.target.value }))
                                            }
                                            rows={3}
                                            className="dash-input w-80 p-2 text-sm"
                                            placeholder="Explain what’s missing (e.g., ID unreadable, name mismatch, etc.)"
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => approve(t.id)}
                                                className="dash-btn-green"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reject(t.id)}
                                                className="dash-btn-neutral"
                                                disabled={!canReject[t.id]}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && (
                                <tr>
                                    <td className="dash-muted px-3 py-6 text-sm" colSpan={5}>
                                        No pending verifications.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
