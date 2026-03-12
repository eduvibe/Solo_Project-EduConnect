import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Notifications() {
    const notifications = usePage().props.notifications || [];
    const [canNotify, setCanNotify] = useState(false);

    const markAllRead = () => {
        router.post(route('dashboard.notifications.read'), {}, { preserveScroll: true });
    };

    useEffect(() => {
        if (!('Notification' in window)) return;
        setCanNotify(true);
    }, []);

    const enableDesktopNotifications = async () => {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') return;
        await Notification.requestPermission();
    };

    return (
        <DashboardLayout title="Notifications">
            <Head title="Notifications" />

            <div className="dash-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold text-white">All notifications</div>
                        <div className="mt-1 text-sm text-white/60">Updates and requests that need your attention.</div>
                    </div>
                    <div className="flex items-center gap-3">
                        {canNotify && Notification.permission !== 'granted' && (
                            <button
                                type="button"
                                onClick={enableDesktopNotifications}
                                className="dash-btn-black"
                            >
                                Enable desktop alerts
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="dash-btn-green"
                        >
                            Mark all read
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                <th className="px-3 py-2">When</th>
                                <th className="px-3 py-2">Type</th>
                                <th className="px-3 py-2">Details</th>
                                <th className="px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="dash-divider">
                            {notifications.map((n) => (
                                <tr key={n.id}>
                                    <td className="px-3 py-3 text-sm text-white/70">{n.created_at}</td>
                                    <td className="px-3 py-3 text-sm font-semibold text-white">{n.type || '—'}</td>
                                    <td className="px-3 py-3 text-sm text-white/70">
                                        {typeof n.data === 'string' ? n.data : JSON.stringify(n.data)}
                                    </td>
                                    <td className="px-3 py-3 text-sm text-white/70">{n.read_at ? 'Read' : 'Unread'}</td>
                                </tr>
                            ))}
                            {notifications.length === 0 && (
                                <tr>
                                    <td className="px-3 py-6 text-sm text-white/70" colSpan={4}>
                                        No notifications yet.
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
