import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function ConfirmBooking() {
    const prefill = usePage().props.prefill || {};
    const flash = usePage().props.flash || {};
    const [form, setForm] = useState({
        teacher_email: String(prefill.teacher_email || ''),
        hourly_rate: '',
        sessions: 4,
        pay_day: 'Friday',
    });

    const canSubmit = useMemo(() => {
        return String(form.teacher_email || '').trim().length > 0 && String(form.hourly_rate || '').trim().length > 0 && Number(form.sessions) >= 1;
    }, [form.hourly_rate, form.sessions, form.teacher_email]);

    const submit = (e) => {
        e.preventDefault();
        router.post(route('bookings.confirm'), form, { preserveScroll: true });
    };

    return (
        <DashboardLayout title="Confirm booking">
            <Head title="Confirm booking" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    {flash.status && (
                        <div className="mb-6 bg-[#9dff52] px-4 py-3 text-base font-semibold text-black">
                            {flash.status}
                        </div>
                    )}

                    <div className="dash-surface p-6">
                        <div className="dash-title text-lg font-semibold">Confirm booking</div>
                        <div className="dash-muted mt-1 text-sm">
                            Enter the tutor’s email and the agreed lesson package. The tutor will accept before the booking is finalized.
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <div className="dash-muted-strong text-sm">Tutor email</div>
                                <input
                                    value={form.teacher_email}
                                    onChange={(e) => setForm((p) => ({ ...p, teacher_email: e.target.value }))}
                                    placeholder="tutor@example.com"
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="dash-muted-strong text-sm">Rate (₦/hr)</div>
                                    <input
                                        value={form.hourly_rate}
                                        onChange={(e) => setForm((p) => ({ ...p, hourly_rate: e.target.value }))}
                                        inputMode="numeric"
                                        className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="dash-muted-strong text-sm">Sessions</div>
                                    <input
                                        value={form.sessions}
                                        onChange={(e) => setForm((p) => ({ ...p, sessions: Number(e.target.value) }))}
                                        type="number"
                                        min={1}
                                        className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="dash-muted-strong text-sm">Pay day</div>
                                <select
                                    value={form.pay_day}
                                    onChange={(e) => setForm((p) => ({ ...p, pay_day: e.target.value }))}
                                    className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" disabled={!canSubmit} className="dash-btn-green px-5 py-3 text-base">
                                Confirm & Pay
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">Tips</div>
                        <ul className="dash-muted mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Confirm details with the tutor before paying.</li>
                            <li>Use the same email the tutor used to register on EduConnect.</li>
                            <li>If the tutor doesn’t accept, you can message them to follow up.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

