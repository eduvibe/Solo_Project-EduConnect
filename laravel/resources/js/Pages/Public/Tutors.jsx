import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Tutors({ filters }) {
    const auth = usePage().props.auth;
    const isAuthed = Boolean(auth?.user);

    const [subject, setSubject] = useState(filters?.subject || '');
    const [level, setLevel] = useState(filters?.level || 'jss');
    const [mode, setMode] = useState(filters?.mode || 'online');
    const [city, setCity] = useState(filters?.city || 'any');

    const tutors = useMemo(
        () => [
            {
                name: 'Amaka',
                city: 'Lagos',
                subjects: ['Mathematics', 'Further Maths'],
                price: 4500,
                rating: 4.9,
                lessons: 214,
                modes: ['online', 'in_person'],
                tags: ['WAEC', 'JSS/SSS', 'UTME'],
            },
            {
                name: 'Ibrahim',
                city: 'Abuja',
                subjects: ['English', 'IELTS'],
                price: 3500,
                rating: 4.8,
                lessons: 182,
                modes: ['online', 'in_person'],
                tags: ['IELTS', 'Writing', 'Oral'],
            },
            {
                name: 'Chinedu',
                city: 'Enugu',
                subjects: ['Physics'],
                price: 4200,
                rating: 4.8,
                lessons: 156,
                modes: ['online'],
                tags: ['WAEC', 'UTME', 'SSS'],
            },
            {
                name: 'Blessing',
                city: 'Port Harcourt',
                subjects: ['Biology', 'Chemistry'],
                price: 3800,
                rating: 4.9,
                lessons: 199,
                modes: ['online', 'in_person'],
                tags: ['WAEC', 'NECO', 'JSS/SSS'],
            },
            {
                name: 'Sade',
                city: 'Ibadan',
                subjects: ['Yorùbá'],
                price: 3000,
                rating: 4.7,
                lessons: 141,
                modes: ['online'],
                tags: ['Conversation', 'Grammar', 'Culture'],
            },
            {
                name: 'Tunde',
                city: 'Lagos',
                subjects: ['Coding'],
                price: 6500,
                rating: 4.9,
                lessons: 267,
                modes: ['online'],
                tags: ['Python', 'Web', 'Projects'],
            },
            {
                name: 'Hauwa',
                city: 'Kano',
                subjects: ['English', 'Literature'],
                price: 3200,
                rating: 4.8,
                lessons: 121,
                modes: ['online'],
                tags: ['WAEC', 'Reading', 'Essay'],
            },
            {
                name: 'Uche',
                city: 'Owerri',
                subjects: ['Igbo'],
                price: 2800,
                rating: 4.7,
                lessons: 98,
                modes: ['online'],
                tags: ['Conversation', 'Basics', 'Culture'],
            },
        ],
        [],
    );

    const results = useMemo(() => {
        const q = subject.trim().toLowerCase();
        return tutors.filter((t) => {
            const matchesCity = city === 'any' ? true : t.city === city;
            const matchesMode = t.modes.includes(mode);
            const matchesSubject =
                q === ''
                    ? true
                    : t.subjects.some((s) => s.toLowerCase().includes(q));
            return matchesCity && matchesMode && matchesSubject;
        });
    }, [tutors, subject, city, mode]);

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route('tutors.index'),
            {
                subject: subject.trim() === '' ? undefined : subject.trim(),
                level,
                mode,
                city,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Find a Tutor" />
            <div className="min-h-screen bg-white text-slate-900">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-brand-700" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-slate-900">
                                    EduConnect
                                </div>
                                <div className="text-xs text-slate-500">
                                    Find a tutor
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {!isAuthed && (
                                <Link
                                    href={route('register', { role: 'teacher' })}
                                    className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline-flex"
                                >
                                    Become a tutor
                                </Link>
                            )}
                            <Link
                                href={isAuthed ? route('dashboard') : route('login')}
                                className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                            >
                                {isAuthed ? 'Dashboard' : 'Manage account'}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-10">
                    <div className="grid gap-6 lg:grid-cols-12">
                        <aside className="lg:col-span-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-sm font-semibold text-slate-900">
                                    Filters
                                </div>

                                <form onSubmit={submit} className="mt-4 space-y-4">
                                    <div>
                                        <div className="text-xs font-semibold text-slate-600">
                                            Subject
                                        </div>
                                        <input
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Mathematics"
                                            className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-xs font-semibold text-slate-600">
                                            Level
                                        </div>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        >
                                            <option value="primary">Primary</option>
                                            <option value="jss">JSS</option>
                                            <option value="sss">SSS</option>
                                            <option value="utme">UTME</option>
                                            <option value="waec">WAEC/NECO</option>
                                            <option value="adult">Adult</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="text-xs font-semibold text-slate-600">
                                            City
                                        </div>
                                        <select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        >
                                            <option value="any">Any</option>
                                            <option value="Lagos">Lagos</option>
                                            <option value="Abuja">Abuja</option>
                                            <option value="Ibadan">Ibadan</option>
                                            <option value="Port Harcourt">Port Harcourt</option>
                                            <option value="Enugu">Enugu</option>
                                            <option value="Kano">Kano</option>
                                            <option value="Owerri">Owerri</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="text-xs font-semibold text-slate-600">
                                            Mode
                                        </div>
                                        <select
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value)}
                                            className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        >
                                            <option value="online">Online</option>
                                            <option value="in_person">In-person</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                    >
                                        Apply filters
                                    </button>
                                </form>
                            </div>
                        </aside>

                        <section className="lg:col-span-8">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Tutors you can book
                                    </h1>
                                    <div className="mt-1 text-sm text-slate-600">
                                        {results.length} result{results.length === 1 ? '' : 's'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {results.map((t) => (
                                    <div
                                        key={t.name}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-sm font-bold text-brand-700">
                                                    {t.name
                                                        .split(' ')
                                                        .slice(0, 2)
                                                        .map((p) => p[0])
                                                        .join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {t.name}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {t.subjects.join(', ')} • {t.city} •{' '}
                                                        {t.modes.includes('in_person')
                                                            ? 'Online & In-person'
                                                            : 'Online'}
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {t.tags.slice(0, 4).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    {t.rating} ★ • {t.lessons} lessons
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    ₦{t.price.toLocaleString()}
                                                    <span className="text-slate-500">
                                                        {' '}
                                                        / hour
                                                    </span>
                                                </div>
                                                <Link
                                                    href={isAuthed ? route('dashboard') : route('login')}
                                                    className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                                >
                                                    Book lesson
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {results.length === 0 && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                                        No tutors match those filters yet. Try a different city or switch to online.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
