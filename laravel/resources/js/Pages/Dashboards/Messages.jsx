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
                        <div className="text-sm font-semibold text-white">Inbox</div>

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
                                            <td className="px-3 py-2 text-sm font-semibold text-white">{m.from?.name}</td>
                                            <td className="px-3 py-2 text-sm text-white/70">{m.to?.name}</td>
                                            <td className="px-3 py-2 text-sm text-white/70">{m.body}</td>
                                            <td className="px-3 py-2 text-xs text-white/60">{m.created_at}</td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-sm text-white/70" colSpan={4}>
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
                        <div className="text-sm font-semibold text-white">New message</div>
                        <form onSubmit={send} className="mt-4 space-y-3">
                            <div>
                                <div className="text-sm text-white/70">To</div>
                                <select
                                    value={toUserId}
                                    onChange={(e) => setToUserId(e.target.value)}
                                    className="mt-1 w-full border-white/10 bg-black text-sm text-white shadow-sm"
                                >
                                    <option value="">Select recipient</option>
                                    {recipients.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="text-sm text-white/70">Message</div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={5}
                                    className="mt-1 w-full border-white/10 bg-black p-3 text-sm text-white shadow-sm"
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
