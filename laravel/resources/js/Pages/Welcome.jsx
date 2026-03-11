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
                'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out ' +
                (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8') +
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
                `relative border border-slate-200 bg-white shadow-sm ${className}`.trim()
            }
        >
            <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-brand-700/80"></div>
            <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-brand-700/80"></div>
            <div className={`relative ${innerClassName}`.trim()}>
                {children}
            </div>
        </div>
    );
}

export default function Welcome({ auth, categoryCounts = {}, teacherCount = 0 }) {
    const isAuthed = Boolean(auth?.user);

    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('jss');
    const [mode, setMode] = useState('online');
    const [city, setCity] = useState('any');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [proofSlideIndex, setProofSlideIndex] = useState(0);

    const formatCount = (n) => {
        const num = Number(n || 0);
        return new Intl.NumberFormat('en', { notation: 'compact' }).format(num);
    };

    const popularCategories = useMemo(
        () => [
            { slug: 'english', title: 'English tutors', query: 'English' },
            { slug: 'mathematics', title: 'Mathematics tutors', query: 'Mathematics' },
            { slug: 'coding', title: 'Coding tutors', query: 'Coding' },
            { slug: 'graphics-design', title: 'Graphics design', query: 'Graphics design' },
            { slug: 'cyber-security', title: 'Cyber security', query: 'Cyber security' },
            { slug: 'ui-ux-design', title: 'UI/UX design', query: 'UI/UX design' },
            { slug: 'hairmaking', title: 'Hairmaking', query: 'Hairmaking' },
            { slug: 'fashion-design', title: 'Fashion design', query: 'Fashion design' },
            { slug: 'ielts', title: 'IELTS prep', query: 'IELTS' },
        ],
        [],
    );

    const proofSlides = useMemo(
        () => [
            {
                img: '/slide-accessibility.svg',
                title: 'Learning that fits real schedules.',
                body: 'Choose a tutor for school subjects or modern skills, then learn online or in-person—whatever works for your routine.',
                stat: 'Make steady progress without disrupting your day.',
                source: 'Built for busy learners',
            },
            {
                img: '/slide-sustainable.svg',
                title: 'Consistency that compounds.',
                body: 'Set a clear goal, show up consistently, and get guidance that keeps you moving—one session at a time.',
                stat: 'Small weekly wins add up quickly.',
                source: 'Designed for momentum',
            },
            {
                img: '/slide-journey.svg',
                title: 'Progress you can actually track.',
                body: 'From the first session to mastery, keep learning structured with clear feedback and visible improvement.',
                stat: 'Confidence grows when learning feels organized.',
                source: 'Made for real outcomes',
            },
        ],
        [],
    );

    const goPrevProofSlide = () => {
        setProofSlideIndex((i) => (i - 1 + proofSlides.length) % proofSlides.length);
    };

    const goNextProofSlide = () => {
        setProofSlideIndex((i) => (i + 1) % proofSlides.length);
    };

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
            <div className="min-h-screen scroll-smooth overflow-x-hidden bg-white text-[18px] text-slate-900">
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
                                className="text-base font-semibold text-white/85 hover:text-white"
                            >
                                Find tutors
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-base font-semibold text-white/85 hover:text-white"
                            >
                                How it works
                            </a>
                            <a
                                href="#subjects"
                                className="text-base font-semibold text-white/85 hover:text-white"
                            >
                                Subjects
                            </a>
                            <Link
                                href={route('reviews.index')}
                                className="text-base font-semibold text-white/85 hover:text-white"
                            >
                                Reviews
                            </Link>
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
                                        className="hidden rounded-lg bg-[#9dff52] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 sm:inline-flex"
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
                                                className="inline-flex items-center justify-center rounded-lg bg-[#9dff52] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
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
                    <section className="bg-white">
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

                                        {isAuthed && (
                                            <Link
                                                href={route('dashboard')}
                                                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-white/90"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mt-10 grid max-w-xl gap-8 sm:grid-cols-3">
                                        {[
                                            { value: '20k+', label: 'Active learners' },
                                            {
                                                value:
                                                    teacherCount > 0
                                                        ? `${formatCount(teacherCount)}+`
                                                        : '1k+',
                                                label: 'Verified tutors',
                                            },
                                            {
                                                value:
                                                    Object.keys(categoryCounts)
                                                        .length > 0
                                                        ? `${formatCount(Object.keys(categoryCounts).length)}+`
                                                        : '80+',
                                                label: 'Skills taught',
                                            },
                                        ].map((s) => (
                                            <div key={s.label}>
                                                <div className="text-2xl font-bold tracking-tight text-black">
                                                    {s.value}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-600">
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            href={route('register', { role: 'teacher' })}
                                            className="text-sm font-semibold text-black/70 hover:text-black"
                                        >
                                            Want to teach? Become a tutor →
                                        </Link>
                                    </div>
                                </Reveal>

                                <Reveal className="lg:col-span-5 lg:justify-self-end">
                                    <div className="relative">
                                        <div className="absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9dff52] sm:h-[420px] sm:w-[420px]"></div>
                                        <img
                                            src="/heroimage.png"
                                            alt="EduConnect hero"
                                            className="w-full max-w-md rounded-[28px] object-cover shadow-[0_22px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
                                        />
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    <section
                        id="subjects"
                        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16"
                    >
                        <Reveal>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                        Popular tutors by category
                                    </h2>
                                    <p className="mt-3 text-base text-slate-600">
                                        Subjects and modern skills—learn what matters today.
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal className="mt-8">
                            <div className="grid gap-4 md:grid-cols-3">
                                {popularCategories.map((c) => (
                                    <Link
                                        key={c.title}
                                        href={route('tutors.index', {
                                            subject: c.query,
                                            level,
                                            mode,
                                            city: city === 'any' ? undefined : city,
                                        })}
                                        className="flex items-center justify-between gap-5 border border-slate-200 bg-white px-5 py-4 shadow-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-11 w-11 items-center justify-center bg-slate-100 text-slate-700">
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
                                                    <path d="M7 7h10" />
                                                    <path d="M7 11h10" />
                                                    <path d="M7 15h7" />
                                                    <path d="M5 21h14a2 2 0 0 0 2-2V7l-5-4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-base font-bold text-slate-900">
                                                    {c.title}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-500">
                                                    {formatCount(categoryCounts[c.slug] || 0)} tutor{(categoryCounts[c.slug] || 0) === 1 ? '' : 's'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex h-11 w-11 items-center justify-center bg-white text-slate-700 ring-1 ring-slate-200">
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
                                    </Link>
                                ))}
                            </div>
                        </Reveal>

                        <div className="mt-8">
                            <Link
                                href={route('tutors.index')}
                                className="inline-flex items-center gap-2 text-base font-semibold text-[#9dff52]"
                            >
                                <span className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white">
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
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                </span>
                                Show more
                            </Link>
                        </div>
                    </section>

                    <section id="outcomes" className="border-t border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <Reveal>
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                                        Learn better with the right match
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
                                        Find a tutor who understands your goal, your pace, and your context—then build progress that sticks.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal className="mt-12">
                                <div className="grid items-center gap-10 lg:grid-cols-12">
                                    <div className="lg:col-span-7">
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={goPrevProofSlide}
                                                className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-slate-900"
                                                aria-label="Previous"
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
                                                    <path d="M15 18l-6-6 6-6" />
                                                </svg>
                                            </button>

                                            <div className="mx-6 flex-1 overflow-hidden border border-slate-200 bg-white">
                                                <div
                                                    className="flex motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
                                                    style={{
                                                        transform: `translateX(-${proofSlideIndex * 100}%)`,
                                                    }}
                                                >
                                                    {proofSlides.map((s) => (
                                                        <div
                                                            key={s.title}
                                                            className="w-full shrink-0 p-6 sm:p-8"
                                                        >
                                                            <div className="relative mx-auto max-w-[520px]">
                                                                <div className="absolute -left-10 top-10 h-[340px] w-[460px] border border-slate-200 bg-white"></div>
                                                                <div className="absolute -left-5 top-5 h-[340px] w-[460px] border border-slate-200 bg-white"></div>
                                                                <div className="relative border border-slate-200 bg-white p-3">
                                                                    <img
                                                                        src={s.img}
                                                                        alt={s.title}
                                                                        className="h-[340px] w-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={goNextProofSlide}
                                                className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-slate-900"
                                                aria-label="Next"
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
                                                    <path d="M9 18l6-6-6-6" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-6 flex items-center justify-center gap-2">
                                            {proofSlides.map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setProofSlideIndex(i)}
                                                    className={
                                                        'h-2.5 w-2.5 border border-slate-200 ' +
                                                        (i === proofSlideIndex
                                                            ? 'bg-[#9dff52]'
                                                            : 'bg-white')
                                                    }
                                                    aria-label={`Slide ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-5">
                                        <div className="text-2xl font-bold tracking-tight text-slate-900">
                                            {proofSlides[proofSlideIndex].title}
                                        </div>
                                        <div className="mt-3 text-base leading-relaxed text-slate-600">
                                            {proofSlides[proofSlideIndex].body}
                                        </div>
                                        <div className="mt-6 border border-slate-200 bg-white p-4 text-base font-semibold text-slate-900">
                                            {proofSlides[proofSlideIndex].stat}
                                        </div>
                                        <div className="mt-3 text-sm font-semibold text-slate-500">
                                            {proofSlides[proofSlideIndex].source}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <section
                        id="how-it-works"
                        className="border-t border-slate-200 bg-white"
                    >
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <Reveal>
                                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                    How EduConnect works:
                                </h2>
                                <p className="mt-3 text-base text-slate-600">
                                    Find the right tutor, start learning, and track progress—week by week.
                                </p>
                            </Reveal>

                            <Reveal className="mt-8">
                                <div className="grid gap-4 lg:grid-cols-3">
                                    <div className="border border-black p-7">
                                        <div className="flex h-10 w-10 items-center justify-center bg-[#9dff52] text-base font-bold text-black">
                                            1
                                        </div>
                                        <div className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                                            Tell us what you want to learn.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            Share your subject or skill, level, and location. We’ll surface tutors that fit what you need.
                                        </div>

                                        <div className="relative mt-10 h-44">
                                            <div className="absolute left-0 top-2 w-56 border border-slate-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-slate-100"></div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-base font-semibold text-slate-900">
                                                            Amina
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-500">
                                                            English tutor • 4.9
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute left-10 top-16 w-56 border border-slate-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-slate-100"></div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-base font-semibold text-slate-900">
                                                            Tolu
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-500">
                                                            Coding tutor • 4.8
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute left-20 top-28 w-56 border border-slate-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-slate-100"></div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-base font-semibold text-slate-900">
                                                            Chisom
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-500">
                                                            Maths tutor • 4.9
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-black p-7">
                                        <div className="flex h-10 w-10 items-center justify-center bg-[#9dff52] text-base font-bold text-black">
                                            2
                                        </div>
                                        <div className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                                            Start with a plan.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            Your tutor adapts each session to your goal—exams, career, or skill-building—so learning stays focused.
                                        </div>

                                        <div className="mt-10 grid grid-cols-2 gap-4">
                                            <div className="border border-slate-200 bg-white p-3">
                                                <img
                                                    src="/heroimage.png"
                                                    alt="Tutor"
                                                    className="h-40 w-full object-cover"
                                                />
                                            </div>
                                            <div className="border border-slate-200 bg-white p-3">
                                                <img
                                                    src="/heroimage.png"
                                                    alt="Student"
                                                    className="h-40 w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-black p-7">
                                        <div className="flex h-10 w-10 items-center justify-center bg-[#9dff52] text-base font-bold text-black">
                                            3
                                        </div>
                                        <div className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                                            Build momentum.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            Keep it consistent, track improvement, and adjust as you grow—week by week.
                                        </div>

                                        <div className="mt-10 border border-slate-200 bg-white p-3">
                                            <img
                                                src="/heroimage.png"
                                                alt="Online lesson"
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <section id="for-tutors" className="border-t border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <Reveal>
                                <div className="overflow-hidden border border-slate-200 bg-white">
                                    <div className="grid lg:grid-cols-12">
                                        <div className="lg:col-span-6">
                                            <img
                                                src="/become-tutor-photo.svg"
                                                alt="Become a tutor"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="lg:col-span-6 bg-[#9dff52] p-8 sm:p-10">
                                            <div className="text-5xl font-bold tracking-tight text-black sm:text-6xl">
                                                Teach on EduConnect
                                            </div>
                                            <div className="mt-4 text-base text-black/80">
                                                Turn your expertise into income. Reach learners, set your schedule, and teach what you know—academics and modern skills.
                                            </div>
                                            <div className="mt-6 space-y-2 text-base font-semibold text-black">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 h-2 w-2 bg-black"></span>
                                                    <div>Reach new learners</div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 h-2 w-2 bg-black"></span>
                                                    <div>Build your tutoring brand</div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 h-2 w-2 bg-black"></span>
                                                    <div>Secure payouts and bookings</div>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <Link
                                                    href={route('register', { role: 'teacher' })}
                                                    className="flex w-full items-center justify-center bg-black px-6 py-4 text-base font-semibold text-white"
                                                >
                                                    Start teaching →
                                                </Link>
                                            </div>

                                            <div className="mt-5 text-center">
                                                <a
                                                    href="#how-it-works"
                                                    className="text-base font-semibold text-black underline"
                                                >
                                                    See how it works
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <footer className="border-t border-white/10 bg-black">
                        <div className="mx-auto max-w-7xl px-6 py-14">
                            <div className="grid gap-10 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <div className="flex items-center gap-3">
                                        <ApplicationLogo className="h-10 w-10 text-white" />
                                        <div className="text-lg font-bold text-white">
                                            EduConnect
                                        </div>
                                    </div>
                                    <div className="mt-4 text-base text-white/70">
                                        Find the right tutor for academics and modern skills. Learn with clarity, consistency, and support.
                                    </div>

                                    <form
                                        className="mt-6 flex gap-2"
                                        onSubmit={(e) => e.preventDefault()}
                                    >
                                        <input
                                            type="email"
                                            placeholder="Get product updates"
                                            className="w-full border border-white/15 bg-black px-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#9dff52] px-5 py-3 text-base font-semibold text-black hover:opacity-90"
                                        >
                                            Join
                                        </button>
                                    </form>
                                </div>

                                <div className="lg:col-span-8">
                                    <div className="grid gap-10 sm:grid-cols-3">
                                        <div>
                                            <div className="text-sm font-bold uppercase tracking-wider text-white/70">
                                                Explore
                                            </div>
                                            <div className="mt-4 space-y-3 text-base text-white/70">
                                                <Link
                                                    href={route('tutors.index')}
                                                    className="block hover:text-white"
                                                >
                                                    Find tutors
                                                </Link>
                                                <a
                                                    href="#subjects"
                                                    className="block hover:text-white"
                                                >
                                                    Categories
                                                </a>
                                                <a
                                                    href="#how-it-works"
                                                    className="block hover:text-white"
                                                >
                                                    How it works
                                                </a>
                                                <Link
                                                    href={route('reviews.index')}
                                                    className="block hover:text-white"
                                                >
                                                    Reviews
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-bold uppercase tracking-wider text-white/70">
                                                Teach
                                            </div>
                                            <div className="mt-4 space-y-3 text-base text-white/70">
                                                <Link
                                                    href={route('register', { role: 'teacher' })}
                                                    className="block hover:text-white"
                                                >
                                                    Become a tutor
                                                </Link>
                                                <Link
                                                    href={isAuthed ? route('dashboard') : route('login')}
                                                    className="block hover:text-white"
                                                >
                                                    {isAuthed ? 'Open dashboard' : 'Tutor sign in'}
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-bold uppercase tracking-wider text-white/70">
                                                Company
                                            </div>
                                            <div className="mt-4 space-y-3 text-base text-white/70">
                                                <a
                                                    href="#"
                                                    className="block hover:text-white"
                                                >
                                                    About
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block hover:text-white"
                                                >
                                                    Terms
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block hover:text-white"
                                                >
                                                    Privacy
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block hover:text-white"
                                                >
                                                    Support
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-white/60">
                                    © {new Date().getFullYear()} EduConnect. All rights reserved.
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-[#9dff52]">
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
                                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2-2-.2-3.7-1.5-4.2-3.4.7.1 1.4.1 2-.1-2.2-.6-3.6-2.7-3.2-5 .6.3 1.3.5 2 .5C1.4 6.7 3 4.2 5.4 4c2.3-.2 4.4.9 5.7 2.6 2-.4 3.9-1.1 5.6-2.2z" />
                                        </svg>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-[#9dff52]">
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
                                            <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <path d="M17.5 6.5h.01" />
                                        </svg>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-[#9dff52]">
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
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect x="2" y="9" width="4" height="12" />
                                            <circle cx="4" cy="4" r="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
