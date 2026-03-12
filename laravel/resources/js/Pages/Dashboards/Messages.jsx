import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Messages() {
    const messages = usePage().props.messages || [];
    const recipients = usePage().props.recipients || [];
    const [toUserId, setToUserId] = useState('');
    const [body, setBody] = useState('');

    const send = (e) => {
        e.preventDefault();
        router.post(route('messages.store'), { to_user_id: Number(toUserId), body }, { preserveScroll: true });
        setBody('');
    };

    return (
        <DashboardLayout title="Messages">
            <Head title="Messages" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">Inbox</div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">From</th>
                                        <th className="px-3 py-2">To</th>
                                        <th className="px-3 py-2">Message</th>
                                        <th className="px-3 py-2">When</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {messages.map((m) => (
                                        <tr key={m.id}>
                                            <td className="dash-title px-3 py-2 text-sm font-semibold">{m.from?.name}</td>
                                            <td className="dash-muted px-3 py-2 text-sm">{m.to?.name}</td>
                                            <td className="dash-muted px-3 py-2 text-sm">{m.body}</td>
                                            <td className="dash-muted px-3 py-2 text-xs">{m.created_at}</td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td className="dash-muted px-3 py-6 text-sm" colSpan={4}>
                                                No messages yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">New message</div>
                        <form onSubmit={send} className="mt-4 space-y-3">
                            <div>
                                <div className="dash-muted-strong text-sm">To</div>
                                <select
                                    value={toUserId}
                                    onChange={(e) => setToUserId(e.target.value)}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                >
                                    <option value="">Select recipient</option>
                                    {recipients.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="dash-muted-strong text-sm">Message</div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={5}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="dash-btn-green px-5 py-3"
                                disabled={!toUserId || body.trim() === ''}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
