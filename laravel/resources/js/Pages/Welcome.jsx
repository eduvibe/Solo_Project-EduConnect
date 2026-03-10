import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Welcome({ auth }) {
    const isAuthed = Boolean(auth?.user);

    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('jss');
    const [mode, setMode] = useState('online');
    const [city, setCity] = useState('any');

    const popularSubjects = useMemo(
        () => [
            'Mathematics',
            'English',
            'Physics',
            'Chemistry',
            'Biology',
            'Further Maths',
            'Literature',
            'French',
            'Yorùbá',
            'Igbo',
            'Coding',
            'IELTS',
        ],
        [],
    );

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

    const filteredTutors = useMemo(() => {
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
    }, [subject, tutors, mode, city]);

    const tutorsUrl = useMemo(() => {
        const query = {};

        if (subject.trim() !== '') {
            query.subject = subject.trim();
        }

        query.level = level;
        query.mode = mode;

        if (city !== 'any') {
            query.city = city;
        }

        return route('tutors.index', query);
    }, [subject, level, mode, city]);

    return (
        <>
            <Head title="EduConnect" />
            <div className="min-h-screen scroll-smooth bg-white text-slate-900">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-brand-700" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-slate-900">
                                    EduConnect
                                </div>
                                <div className="text-xs text-slate-500">
                                    Preply-style tutoring, built for Nigeria
                                </div>
                            </div>
                        </div>

                        <nav className="hidden items-center gap-6 md:flex">
                            <Link
                                href={route('tutors.index')}
                                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                            >
                                Find a tutor
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                            >
                                How it works
                            </a>
                            <a
                                href="#subjects"
                                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                            >
                                Subjects
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {isAuthed ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register', { role: 'teacher' })}
                                        className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline-flex"
                                    >
                                        Become a tutor
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        Manage account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute left-1/2 top-[-240px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-brand-100 blur-3xl"></div>
                            <div className="absolute right-[-180px] top-[120px] h-[480px] w-[480px] rounded-full bg-emerald-100 blur-3xl"></div>
                        </div>

                        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
                            <div className="grid items-center gap-12 lg:grid-cols-2">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                                        <span className="h-2 w-2 rounded-full bg-brand-700"></span>
                                        Verified tutors • Online & in-person • Pay in ₦
                                    </div>
                                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                        Find the right tutor for your child in minutes.
                                    </h1>
                                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                                        Search by subject, level, and location. Book lessons, message tutors, and track
                                        progress in one place.
                                    </p>

                                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="grid gap-3 sm:grid-cols-12">
                                            <div className="sm:col-span-4">
                                                <div className="text-xs font-semibold text-slate-600">
                                                    Subject
                                                </div>
                                                <input
                                                    value={subject}
                                                    onChange={(e) =>
                                                        setSubject(e.target.value)
                                                    }
                                                    placeholder="e.g. Mathematics, English, Coding"
                                                    className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <div className="text-xs font-semibold text-slate-600">
                                                    Level
                                                </div>
                                                <select
                                                    value={level}
                                                    onChange={(e) =>
                                                        setLevel(e.target.value)
                                                    }
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

                                            <div className="sm:col-span-3">
                                                <div className="text-xs font-semibold text-slate-600">
                                                    City
                                                </div>
                                                <select
                                                    value={city}
                                                    onChange={(e) =>
                                                        setCity(e.target.value)
                                                    }
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

                                            <div className="sm:col-span-2">
                                                <div className="text-xs font-semibold text-slate-600">
                                                    Mode
                                                </div>
                                                <select
                                                    value={mode}
                                                    onChange={(e) =>
                                                        setMode(e.target.value)
                                                    }
                                                    className="mt-2 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                >
                                                    <option value="online">Online</option>
                                                    <option value="in_person">In-person</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    Trial lessons
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    Verified profiles
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    Messaging
                                                </div>
                                            </div>

                                            <Link
                                                href={tutorsUrl}
                                                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                            >
                                                Search tutors
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        {isAuthed ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                                            >
                                                Go to dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                                            >
                                                Get started
                                            </Link>
                                        )}
                                        <a
                                            href="#how-it-works"
                                            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                        >
                                            How it works
                                        </a>
                                    </div>

                                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="text-2xl font-bold text-slate-900">
                                                1k+
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                Tutors across Nigeria
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="text-2xl font-bold text-slate-900">
                                                4.8/5
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                Average parent rating
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="text-2xl font-bold text-slate-900">
                                                ₦
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                Local pricing & payment
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {tutors.slice(0, 4).map((t) => (
                                            <div
                                                key={t.name}
                                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            {t.name}{' '}
                                                            <span className="text-slate-500">
                                                                • {t.subjects[0]}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {t.city} •{' '}
                                                            {t.modes.includes(
                                                                'in_person',
                                                            )
                                                                ? 'Online & In-person'
                                                                : 'Online only'}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                        {t.rating} ★
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-sm font-semibold text-slate-900">
                                                    ₦{t.price.toLocaleString()}{' '}
                                                    <span className="text-slate-500">
                                                        / hour
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {t.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-4 text-xs text-slate-500">
                                                    {t.lessons} lessons
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="subjects" className="mx-auto max-w-7xl px-6 py-16">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Popular subjects
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    WAEC/NECO, UTME prep, languages, and tech.
                                </p>
                            </div>
                            <Link
                                href={route('tutors.index')}
                                className="text-left text-sm font-semibold text-brand-700 hover:text-brand-800"
                            >
                                Explore tutors →
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {popularSubjects.map((s) => (
                                <Link
                                    key={s}
                                    href={route('tutors.index', {
                                        subject: s,
                                        level,
                                        mode,
                                        city: city === 'any' ? undefined : city,
                                    })}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-slate-300"
                                >
                                    <div className="text-sm font-semibold text-slate-900">
                                        {s}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Tutors for {s}
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                                        Browse →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section id="how-it-works" className="border-t border-slate-200 bg-slate-50">
                        <div className="mx-auto max-w-7xl px-6 py-16">
                            <h2 className="text-2xl font-bold text-slate-900">
                                How it works
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Search, book, learn—simple and familiar.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                        1
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-slate-900">
                                        Search tutors
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Filter by subject, level, mode, and city.
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                        2
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-slate-900">
                                        Book a lesson
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Choose a time that works and start learning.
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                        3
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-slate-900">
                                        Track progress
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Messaging, lesson notes, and ongoing support.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="tutors" className="mx-auto max-w-7xl px-6 py-16">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Tutors you can book
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    {filteredTutors.length} tutor{filteredTutors.length === 1 ? '' : 's'} for{' '}
                                    <span className="font-semibold text-slate-900">
                                        {subject.trim() === '' ? 'any subject' : subject.trim()}
                                    </span>{' '}
                                    •{' '}
                                    <span className="font-semibold text-slate-900">
                                        {level.toUpperCase()}
                                    </span>{' '}
                                    •{' '}
                                    <span className="font-semibold text-slate-900">
                                        {mode === 'online' ? 'Online' : 'In-person'}
                                    </span>{' '}
                                    •{' '}
                                    <span className="font-semibold text-slate-900">
                                        {city === 'any' ? 'Any city' : city}
                                    </span>
                                </p>
                            </div>
                            {isAuthed ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                >
                                    Open dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                >
                                    Get started
                                </Link>
                            )}
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredTutors.map((t) => (
                                <div
                                    key={t.name}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                {t.name}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {t.subjects.join(', ')} • {t.city}
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {t.rating} ★
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-slate-900">
                                        ₦{t.price.toLocaleString()}{' '}
                                        <span className="text-slate-500">
                                            / hour
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {t.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                        <div>{t.lessons} lessons</div>
                                        <div>
                                            {t.modes.includes('in_person')
                                                ? 'Online & In-person'
                                                : 'Online'}
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        {isAuthed ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                            >
                                                Book lesson
                                            </Link>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                            >
                                                Get started
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTutors.length === 0 && (
                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                                No tutors match those filters yet. Try changing mode or city.
                            </div>
                        )}
                    </section>

                    <section className="border-t border-slate-200 bg-slate-50">
                        <div className="mx-auto max-w-7xl px-6 py-16">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Trusted by parents
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Real outcomes, local context, consistent support.
                            </p>

                            <div className="mt-8 grid gap-4 lg:grid-cols-3">
                                {[
                                    {
                                        quote: 'My daughter improved from C to A in Mathematics in one term. Booking was easy and the tutor was punctual.',
                                        name: 'Parent, Lagos',
                                    },
                                    {
                                        quote: 'We found an English tutor for WAEC prep quickly. The messaging and lesson notes made it easy to track progress.',
                                        name: 'Parent, Abuja',
                                    },
                                    {
                                        quote: 'The tutor understood the Nigerian curriculum and taught with patience. My son finally enjoys learning again.',
                                        name: 'Parent, Port Harcourt',
                                    },
                                ].map((t) => (
                                    <div
                                        key={t.name}
                                        className="rounded-2xl border border-slate-200 bg-white p-6"
                                    >
                                        <div className="text-sm leading-relaxed text-slate-700">
                                            “{t.quote}”
                                        </div>
                                        <div className="mt-4 text-sm font-semibold text-slate-900">
                                            {t.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-16">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        For parents
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Discover tutors, book lessons, and stay informed with a clear learning plan.
                                    </p>
                                    <div className="mt-6">
                                        {isAuthed ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="inline-flex items-center rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                                            >
                                                Open dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                                            >
                                                Get started
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        For tutors
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Build a profile, set availability, and teach families who value your work.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('register', { role: 'teacher' })}
                                            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                                        >
                                            Become a tutor
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-10">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo className="h-9 w-9 text-brand-700" />
                                    <div className="text-sm font-semibold text-slate-900">
                                        EduConnect
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                                    <a href="#tutors" className="hover:text-slate-900">
                                        Find a tutor
                                    </a>
                                    <a href="#how-it-works" className="hover:text-slate-900">
                                        How it works
                                    </a>
                                    <a href="#subjects" className="hover:text-slate-900">
                                        Subjects
                                    </a>
                                    <Link href={route('login')} className="hover:text-slate-900">
                                        Manage account
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-8 text-xs text-slate-500">
                                © {new Date().getFullYear()} EduConnect. Built for Nigerian tutors and parents.
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
