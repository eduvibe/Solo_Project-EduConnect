import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function dayLabel(key) {
    const map = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
    };
    return map[String(key || '').toLowerCase()] || String(key || '');
}

function buildSlotsForDay(dayKey, row) {
    if (!row?.enabled) return [];
    const start = String(row.start || '');
    const end = String(row.end || '');
    if (start.length < 4 || end.length < 4) return [];
    const [sh, sm] = start.split(':').map((n) => Number(n));
    const [eh, em] = end.split(':').map((n) => Number(n));
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const slots = [];
    for (let t = startMin; t + 60 <= endMin; t += 60) {
        const h = String(Math.floor(t / 60)).padStart(2, '0');
        const m = String(t % 60).padStart(2, '0');
        slots.push(`${h}:${m}`);
    }
    return slots;
}

export default function BookTutor({ tutor }) {
    const flash = usePage().props.flash;
    const walletKobo = Number(usePage().props.wallet_balance_kobo || 0);
    const hourlyKobo = Number(tutor?.hourly_rate_cents || 0);
    const hourlyNaira = Math.floor(hourlyKobo / 100);
    const availability = tutor?.availability || {};

    const enabledDays = useMemo(() => {
        const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        return days
            .map((d) => ({ key: d, row: availability?.[d] }))
            .filter((x) => x.row && x.row.enabled);
    }, [availability]);

    const dayOptions = enabledDays.map((d) => ({ value: d.key, label: dayLabel(d.key) }));

    const [kind, setKind] = useState('trial');
    const [dayOfWeek, setDayOfWeek] = useState(dayOptions[0]?.value || '');
    const [startTime, setStartTime] = useState(() => {
        const firstRow = enabledDays[0]?.row;
        const slots = buildSlotsForDay(enabledDays[0]?.key, firstRow);
        return slots[0] || '';
    });
    const [lessonsPerWeek, setLessonsPerWeek] = useState(1);

    const timeSlots = useMemo(() => {
        const row = availability?.[dayOfWeek];
        return buildSlotsForDay(dayOfWeek, row);
    }, [availability, dayOfWeek]);

    const totalLessons = kind === 'trial' ? 1 : lessonsPerWeek * 4;
    const totalNaira = hourlyNaira * totalLessons;
    const affordableLessons = hourlyKobo > 0 ? Math.floor(walletKobo / hourlyKobo) : 0;

    const canSubmit = useMemo(() => {
        if (!tutor?.id) return false;
        if (kind === 'trial') return dayOfWeek !== '' && startTime !== '';
        return [1, 2, 3, 5].includes(Number(lessonsPerWeek));
    }, [dayOfWeek, kind, lessonsPerWeek, startTime, tutor?.id]);

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            tutor_id: tutor.id,
            kind,
            day_of_week: kind === 'trial' ? dayOfWeek : undefined,
            start_time: kind === 'trial' ? startTime : undefined,
            lessons_per_week: kind === 'subscription' ? lessonsPerWeek : undefined,
        };
        router.post(route('booking-intents.store'), payload);
    };

    return (
        <DashboardLayout title="Book tutor">
            <Head title="Book tutor" />

            {flash?.status && (
                <div className="mb-6 bg-[#9dff52] px-4 py-3 text-base font-semibold text-black">
                    {flash.status}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-lg font-semibold">{tutor?.name}</div>
                        <div className="dash-muted mt-1 text-sm">
                            Rate: ₦{hourlyNaira.toLocaleString()} per lesson (60 minutes)
                        </div>
                        <div className="dash-muted mt-2 text-sm">
                            Your wallet: ₦{Math.floor(walletKobo / 100).toLocaleString()} • This tutor rate allows about {affordableLessons} lesson{affordableLessons === 1 ? '' : 's'} with your current balance.
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <div className="dash-muted-strong text-sm">Booking type</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setKind('trial')}
                                        className={kind === 'trial' ? 'dash-btn-green px-4 py-2 text-sm' : 'dash-btn-neutral px-4 py-2 text-sm'}
                                    >
                                        Trial lesson
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setKind('subscription')}
                                        className={kind === 'subscription' ? 'dash-btn-green px-4 py-2 text-sm' : 'dash-btn-neutral px-4 py-2 text-sm'}
                                    >
                                        Weekly plan (4 weeks)
                                    </button>
                                </div>
                            </div>

                            {kind === 'trial' ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <div className="dash-muted-strong text-sm">Day</div>
                                        <select
                                            value={dayOfWeek}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setDayOfWeek(v);
                                                const slots = buildSlotsForDay(v, availability?.[v]);
                                                setStartTime(slots[0] || '');
                                            }}
                                            className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                            required
                                        >
                                            {dayOptions.map((d) => (
                                                <option key={d.value} value={d.value}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <div className="dash-muted-strong text-sm">Time</div>
                                        <select
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="dash-input mt-1 w-full p-3 text-sm shadow-sm"
                                            required
                                        >
                                            {timeSlots.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="dash-muted-strong text-sm">Lessons per week</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {[1, 2, 3, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setLessonsPerWeek(n)}
                                                className={Number(lessonsPerWeek) === n ? 'dash-btn-green px-4 py-2 text-sm' : 'dash-btn-neutral px-4 py-2 text-sm'}
                                            >
                                                {n} / week
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="dash-surface p-4">
                                <div className="dash-title text-sm font-semibold">Summary</div>
                                <div className="dash-muted mt-2 text-sm">
                                    {kind === 'trial' ? 'Trial lesson: 1 lesson' : `Plan: ${lessonsPerWeek} lesson${lessonsPerWeek === 1 ? '' : 's'} / week × 4 weeks (${totalLessons} lessons)`}
                                </div>
                                <div className="dash-muted mt-2 text-sm">
                                    Total due: ₦{totalNaira.toLocaleString()}
                                </div>
                            </div>

                            <button type="submit" disabled={!canSubmit} className="dash-btn-green px-5 py-3 text-base">
                                Proceed to payment
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">How it works</div>
                        <ul className="dash-muted mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>You’ll get bank transfer instructions with a unique reference.</li>
                            <li>After transfer, submit the bank reference for approval.</li>
                            <li>Admin confirms payment and credits your wallet.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
