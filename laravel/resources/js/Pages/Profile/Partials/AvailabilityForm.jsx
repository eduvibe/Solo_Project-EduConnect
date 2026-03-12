import { useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const DAYS = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' },
];

function normalizeAvailability(raw) {
    const base = {};
    for (const d of DAYS) {
        const v = raw?.[d.key] || {};
        base[d.key] = {
            enabled: Boolean(v.enabled),
            start: v.start || '',
            end: v.end || '',
        };
    }
    return base;
}

export default function AvailabilityForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, processing } = useForm({
        availability: normalizeAvailability(user.availability),
    });

    const canSubmit = useMemo(() => {
        for (const d of DAYS) {
            const v = data.availability[d.key];
            if (v.enabled && (v.start.trim() === '' || v.end.trim() === '')) return false;
        }
        return true;
    }, [data.availability]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.availability.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className={className}>
            <div className="dash-title text-sm font-semibold">Availability</div>
            <div className="dash-muted mt-1 text-sm">
                Set the days and times you’re available. Parents see this when booking and scheduling sessions.
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                            <th className="px-3 py-2">Day</th>
                            <th className="px-3 py-2">Available</th>
                            <th className="px-3 py-2">Start</th>
                            <th className="px-3 py-2">End</th>
                        </tr>
                    </thead>
                    <tbody className="dash-divider">
                        {DAYS.map((d) => {
                            const v = data.availability[d.key];
                            return (
                                <tr key={d.key}>
                                    <td className="dash-title px-3 py-3 text-sm font-semibold">
                                        {d.label}
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="checkbox"
                                            checked={v.enabled}
                                            onChange={(e) =>
                                                setData('availability', {
                                                    ...data.availability,
                                                    [d.key]: { ...v, enabled: e.target.checked },
                                                })
                                            }
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="time"
                                            value={v.start}
                                            disabled={!v.enabled}
                                            onChange={(e) =>
                                                setData('availability', {
                                                    ...data.availability,
                                                    [d.key]: { ...v, start: e.target.value },
                                                })
                                            }
                                            className="dash-input w-full p-2 text-sm disabled:opacity-60"
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="time"
                                            value={v.end}
                                            disabled={!v.enabled}
                                            onChange={(e) =>
                                                setData('availability', {
                                                    ...data.availability,
                                                    [d.key]: { ...v, end: e.target.value },
                                                })
                                            }
                                            className="dash-input w-full p-2 text-sm disabled:opacity-60"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={!canSubmit || processing}
                    className="dash-btn-green px-5 py-2"
                >
                    Save availability
                </button>
            </div>
        </form>
    );
}
