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
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Inbox</div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="px-3 py-2">From</th>
                                        <th className="px-3 py-2">To</th>
                                        <th className="px-3 py-2">Message</th>
                                        <th className="px-3 py-2">When</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {messages.map((m) => (
                                        <tr key={m.id}>
                                            <td className="px-3 py-2 text-sm font-semibold text-slate-900">{m.from?.name}</td>
                                            <td className="px-3 py-2 text-sm text-slate-800">{m.to?.name}</td>
                                            <td className="px-3 py-2 text-sm text-slate-800">{m.body}</td>
                                            <td className="px-3 py-2 text-xs text-slate-500">{m.created_at}</td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-base text-slate-700" colSpan={4}>
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
                    <div className="bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">New message</div>
                        <form onSubmit={send} className="mt-4 space-y-3">
                            <div>
                                <div className="text-sm text-slate-600">To</div>
                                <select
                                    value={toUserId}
                                    onChange={(e) => setToUserId(e.target.value)}
                                    className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                >
                                    <option value="">Select recipient</option>
                                    {recipients.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Message</div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={5}
                                    className="mt-1 w-full border-slate-300 text-base shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-black px-5 py-3 text-base font-semibold text-white"
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
