import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || inView) return;

        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setInView(true);
                        obs.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.15, ...options },
        );

        obs.observe(el);

        return () => obs.disconnect();
    }, [inView, options]);

    return [ref, inView];
}

function Reveal({ children, className = '' }) {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className={
                'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ' +
                (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5') +
                (className ? ` ${className}` : '')
            }
        >
            {children}
        </div>
    );
}

function BracketCard({ children, className = '', innerClassName = '' }) {
    return (
        <div
            className={
                `group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm motion-safe:transition motion-safe:duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${className}`.trim()
            }
        >
            <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-tl-2xl border-l-2 border-t-2 border-brand-700/80"></div>
            <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 rounded-br-2xl border-b-2 border-r-2 border-brand-700/80"></div>
            <div className={`relative rounded-3xl ${innerClassName}`.trim()}>
                {children}
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    const isAuthed = Boolean(auth?.user);

    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('jss');
    const [mode, setMode] = useState('online');
    const [city, setCity] = useState('any');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="min-h-screen scroll-smooth overflow-x-hidden bg-white text-slate-900">
                <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 text-white backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-white" />
                            <div className="text-sm font-semibold text-white">
                                EduConnect
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-8 md:flex">
                            <Link
                                href={route('tutors.index')}
                                className="text-sm font-semibold text-white/85 hover:text-white"
                            >
                                Find tutors
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-sm font-semibold text-white/85 hover:text-white"
                            >
                                How it works
                            </a>
                            <a
                                href="#subjects"
                                className="text-sm font-semibold text-white/85 hover:text-white"
                            >
                                Subjects
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {isAuthed ? (
                                <Link
                                    href={route('dashboard')}
                                    className="hidden rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 sm:inline-flex"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register', { role: 'teacher' })}
                                        className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 md:inline-flex"
                                    >
                                        Teach on EduConnect
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 sm:inline-flex"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hidden rounded-lg bg-[#9dff52] px-4 py-2 text-sm font-semibold text-black hover:bg-[#b7ff7f] sm:inline-flex"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 p-2 text-white shadow-sm hover:bg-white/15 md:hidden"
                                aria-label="Open menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 12h18" />
                                    <path d="M3 6h18" />
                                    <path d="M3 18h18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        className={
                            (mobileMenuOpen ? 'block' : 'hidden') +
                            ' md:hidden'
                        }
                    >
                        <div className="border-t border-white/10 bg-black/90 px-6 py-4 backdrop-blur">
                            <div className="grid gap-2">
                                <Link
                                    href={route('tutors.index')}
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Find tutors
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    How it works
                                </a>
                                <a
                                    href="#subjects"
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Subjects
                                </a>

                                <div className="mt-2 grid gap-2">
                                    {isAuthed ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-white/90"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center justify-center rounded-lg bg-[#9dff52] px-4 py-2 text-sm font-semibold text-black hover:bg-[#b7ff7f]"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Get started
                                            </Link>
                                            <Link
                                                href={route('register', {
                                                    role: 'teacher',
                                                })}
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-white/90"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Become a tutor
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="bg-[#9dff52]">
                        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
                            <div className="grid items-center gap-12 lg:grid-cols-12">
                                <Reveal className="lg:col-span-7">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-xs font-semibold text-black ring-1 ring-black/10">
                                        <span className="text-black">
                                            ★★★★★
                                        </span>
                                        <span className="text-black/70">
                                            4.8 average rating from parents
                                        </span>
                                    </div>
                                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-6xl">
                                        Because learning is complicated enough.
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/70 sm:text-lg">
                                        Find verified tutors for WAEC/NECO, UTME, languages, and STEM. Book lessons, chat
                                        instantly, and track progress—without stress.
                                    </p>

                                    <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
                                        <div className="flex w-full items-center rounded-full bg-white p-2 ring-1 ring-black/10">
                                            <div className="flex flex-1 items-center gap-3 px-3">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-5 w-5 text-slate-500"
                                                >
                                                    <path d="m21 21-4.3-4.3" />
                                                    <circle cx="11" cy="11" r="7" />
                                                </svg>
                                                <input
                                                    value={subject}
                                                    onChange={(e) =>
                                                        setSubject(e.target.value)
                                                    }
                                                    placeholder="What does your child need help with?"
                                                    className="h-11 w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                                />
                                            </div>
                                            <Link
                                                href={tutorsUrl}
                                                className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-black/90"
                                            >
                                                Find tutors
                                            </Link>
                                        </div>

                                        <Link
                                            href={route('register', { role: 'teacher' })}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-black px-6 text-sm font-semibold text-white hover:bg-black/90"
                                        >
                                            Become a tutor
                                        </Link>

                                        {isAuthed && (
                                            <Link
                                                href={route('dashboard')}
                                                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-white/90"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                                        {[
                                            { value: '20k+', label: 'Active learners' },
                                            { value: '1k+', label: 'Verified tutors' },
                                            { value: '80+', label: 'Subjects' },
                                        ].map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-2xl bg-white p-4 ring-1 ring-black/10"
                                            >
                                                <div className="text-lg font-bold text-black">
                                                    {s.value}
                                                </div>
                                                <div className="mt-1 text-xs font-semibold text-slate-600">
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Reveal>

                                <Reveal className="lg:col-span-5 lg:justify-self-end">
                                    <div className="relative">
                                        <div className="absolute -inset-10 -z-10 rounded-full bg-white/10 blur-3xl"></div>
                                        <img
                                            src="/heroimage.png"
                                            alt="EduConnect hero"
                                            className="w-full max-w-md rounded-[28px] object-cover shadow-[0_22px_60px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
                                        />
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-6 pb-6 pt-14">
                        <Reveal>
                            <div className="text-center">
                                <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                                    Why EduConnect
                                </div>
                                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    3 Reasons To Choose Us
                                </h2>
                                <p className="mt-3 text-sm text-slate-600">
                                    Designed to feel premium, clear, and reliable—on every device.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal className="mt-8">
                            <div className="grid gap-6 md:grid-cols-3">
                                {[
                                    {
                                        title: '24/7 Support',
                                        desc: 'Our tutors are always available for your child and ready to teach.',
                                        icon: (
                                            <>
                                                <path d="M4 12a8 8 0 0 1 16 0" />
                                                <path d="M4 12v5a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z" />
                                                <path d="M20 12v5a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
                                            </>
                                        ),
                                    },
                                    {
                                        title: 'Top Guide',
                                        desc: 'Learn from the best tutors with proven track records and clarity.',
                                        icon: (
                                            <>
                                                <path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" />
                                                <path d="M4 19.5a2.5 2.5 0 0 0 2.5 2.5H20" />
                                                <path d="M8 7h8" />
                                                <path d="M8 11h8" />
                                            </>
                                        ),
                                    },
                                    {
                                        title: 'Best Course',
                                        desc: 'Curriculum-aligned lessons that produce real results and confidence.',
                                        icon: (
                                            <>
                                                <path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.3L12 16.8 6.4 19.6l1.1-6.3L3 8.9 9 8z" />
                                            </>
                                        ),
                                    },
                                ].map((c) => (
                                    <BracketCard key={c.title} innerClassName="bg-white p-7">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/20">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 w-5"
                                            >
                                                {c.icon}
                                            </svg>
                                        </div>
                                        <div className="mt-5 text-base font-bold text-slate-900">
                                            {c.title}
                                        </div>
                                        <div className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {c.desc}
                                        </div>

                                        <div className="mt-5">
                                            <Link
                                                href={route('tutors.index')}
                                                className="inline-flex items-center rounded-full border border-brand-700 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </BracketCard>
                                ))}
                            </div>
                        </Reveal>
                    </section>

                    <section id="subjects" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                        <Reveal>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Popular subjects
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Curated for the Nigerian curriculum and exams.
                                    </p>
                                </div>
                                <Link
                                    href={route('tutors.index')}
                                    className="inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                                >
                                    View more
                                </Link>
                            </div>
                        </Reveal>

                        <Reveal className="mt-8">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                                {popularSubjects.slice(0, 5).map((s) => (
                                    <Link
                                        key={s}
                                        href={route('tutors.index', {
                                            subject: s,
                                            level,
                                            mode,
                                            city: city === 'any' ? undefined : city,
                                        })}
                                        className="block"
                                    >
                                        <BracketCard innerClassName="bg-white p-6">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-sm font-bold text-slate-900">
                                                    {s}
                                                </div>
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/20">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-5 w-5"
                                                    >
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm text-slate-600">
                                                Browse tutors
                                            </div>
                                            <div className="mt-6 flex items-center justify-between text-xs font-semibold text-slate-500">
                                                <div>
                                                    {mode === 'online'
                                                        ? 'Online available'
                                                        : 'In-person available'}
                                                </div>
                                                <div className="text-brand-700">
                                                    Read More →
                                                </div>
                                            </div>
                                        </BracketCard>
                                    </Link>
                                ))}
                            </div>
                        </Reveal>
                    </section>

                    <section
                        id="how-it-works"
                        className="border-t border-slate-200 bg-slate-50"
                    >
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <Reveal>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    How it works
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    A familiar flow: search, book, learn, repeat.
                                </p>
                            </Reveal>

                            <Reveal className="mt-8">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {[
                                        {
                                            step: '01',
                                            title: 'Search tutors',
                                            desc: 'Filter by subject, level, mode, and city.',
                                        },
                                        {
                                            step: '02',
                                            title: 'Book a lesson',
                                            desc: 'Pick a time and pay securely in ₦.',
                                        },
                                        {
                                            step: '03',
                                            title: 'Track progress',
                                            desc: 'Messages, notes, and steady improvement.',
                                        },
                                    ].map((s) => (
                                        <BracketCard key={s.step} innerClassName="bg-white p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                                                    {s.step}
                                                </div>
                                                <div className="text-xs font-semibold text-slate-500">
                                                    Step
                                                </div>
                                            </div>
                                            <div className="mt-4 text-sm font-semibold text-slate-900">
                                                {s.title}
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                {s.desc}
                                            </div>
                                        </BracketCard>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <section id="tutors" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
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
                            <Link
                                href={tutorsUrl}
                                className="inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                            >
                                View more
                            </Link>
                        </div>

                        <Reveal className="mt-8">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filteredTutors.slice(0, 4).map((t) => (
                                    <div
                                        key={t.name}
                                    >
                                        <BracketCard innerClassName="bg-white p-0">
                                            <img
                                                src="/heroimage.png"
                                                alt={`${t.name} - ${t.subjects[0]}`}
                                                className="h-40 w-full object-cover"
                                            />
                                            <div className="p-6">
                                                <div className="text-sm font-bold text-slate-900">
                                                    {t.name}
                                                </div>
                                                <div className="mt-1 text-xs text-slate-500">
                                                    {t.subjects.join(', ')} • {t.city}
                                                </div>
                                                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-600">
                                                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                                                        <span>{t.rating} ★</span>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                                                        <span>{t.lessons} lessons</span>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                                                        <span>₦{t.price.toLocaleString()}/hr</span>
                                                    </div>
                                                </div>
                                                <div className="mt-6">
                                                    <Link
                                                        href={route('tutors.index', {
                                                            subject: t.subjects?.[0] || undefined,
                                                            level,
                                                            mode,
                                                            city: city === 'any' ? undefined : city,
                                                        })}
                                                        className="inline-flex items-center rounded-full border border-brand-700 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                                                    >
                                                        Read More →
                                                    </Link>
                                                </div>
                                            </div>
                                        </BracketCard>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {filteredTutors.length === 0 && (
                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                                No tutors match those filters yet. Try changing mode or city.
                            </div>
                        )}
                    </section>

                    <section id="testimonials" className="border-t border-slate-200 bg-slate-50">
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Trusted by parents
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Real outcomes, local context, consistent support.
                            </p>

                            <Reveal className="mt-8">
                                <div className="grid gap-4 lg:grid-cols-3">
                                    {[
                                        {
                                            quote: 'Our son moved from C to A in Mathematics within one term. The tutor was consistent and communicated clearly.',
                                            name: 'Parent • Lagos',
                                        },
                                        {
                                            quote: 'WAEC prep became structured. Weekly lesson notes helped us track progress without stress.',
                                            name: 'Parent • Abuja',
                                        },
                                        {
                                            quote: 'The tutor understood the Nigerian curriculum and taught with patience. We saw confidence improve quickly.',
                                            name: 'Parent • Port Harcourt',
                                        },
                                    ].map((t) => (
                                        <BracketCard
                                            key={t.name}
                                            innerClassName="bg-white p-6"
                                        >
                                            <div className="text-sm leading-relaxed text-slate-700">
                                                “{t.quote}”
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {t.name}
                                                </div>
                                                <div className="text-xs font-semibold text-emerald-700">
                                                    Verified
                                                </div>
                                            </div>
                                        </BracketCard>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <section id="for-tutors" className="border-t border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Reveal>
                                    <BracketCard innerClassName="bg-slate-50 p-8">
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
                                    </BracketCard>
                                </Reveal>

                                <Reveal>
                                    <BracketCard innerClassName="bg-slate-50 p-8">
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
                                    </BracketCard>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    <footer className="border-t border-white/10 bg-black">
                        <div className="mx-auto max-w-7xl px-6 py-10">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo className="h-9 w-9 text-white" />
                                    <div className="text-sm font-semibold text-white">
                                        EduConnect
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                                    <a href="#tutors" className="hover:text-white">
                                        Find tutors
                                    </a>
                                    <a href="#how-it-works" className="hover:text-white">
                                        How it works
                                    </a>
                                    <a href="#subjects" className="hover:text-white">
                                        Subjects
                                    </a>
                                    <Link
                                        href={route('register', { role: 'teacher' })}
                                        className="hover:text-white"
                                    >
                                        Become a tutor
                                    </Link>
                                    <Link
                                        href={isAuthed ? route('dashboard') : route('login')}
                                        className="hover:text-white"
                                    >
                                        {isAuthed ? 'Dashboard' : 'Sign in'}
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-8 text-xs text-white/60">
                                © {new Date().getFullYear()} EduConnect. Built for Nigerian tutors and parents.
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
