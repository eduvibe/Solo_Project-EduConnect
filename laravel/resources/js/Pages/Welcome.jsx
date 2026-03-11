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

                    <section
                        id="why-choose-us"
                        className="border-t border-slate-200 bg-white"
                    >
                        <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
                            <Reveal>
                                <div className="flex items-center justify-between gap-6">
                                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                        Why Choose Us
                                    </h2>
                                </div>
                            </Reveal>

                            <div className="mt-10 grid gap-10 lg:grid-cols-12">
                                <Reveal className="lg:col-span-4">
                                    <div className="border border-slate-200">
                                        <div className="p-4">
                                            <img
                                                src="/heroimage.png"
                                                alt="Learning support"
                                                className="h-56 w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal className="lg:col-span-8">
                                    <div className="grid gap-10 sm:grid-cols-3">
                                        {[
                                            {
                                                title: 'Accessibility',
                                                desc: 'Find tutors for academics and real-world skills—online or in-person.',
                                                icon: (
                                                    <>
                                                        <path d="M12 2v20" />
                                                        <path d="M2 12h20" />
                                                    </>
                                                ),
                                            },
                                            {
                                                title: 'Sustainable',
                                                desc: 'Clear progress, consistent support, and learning plans that last.',
                                                icon: (
                                                    <>
                                                        <path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.3L12 16.8 6.4 19.6l1.1-6.3L3 8.9 9 8z" />
                                                    </>
                                                ),
                                            },
                                            {
                                                title: 'Journey',
                                                desc: 'From first lesson to mastery—your child grows with guidance and structure.',
                                                icon: (
                                                    <>
                                                        <path d="M3 17l6-6 4 4 8-8" />
                                                        <path d="M21 7v6h-6" />
                                                    </>
                                                ),
                                            },
                                        ].map((f) => (
                                            <div key={f.title}>
                                                <div className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-[#9dff52]">
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
                                                        {f.icon}
                                                    </svg>
                                                </div>
                                                <div className="mt-5 text-base font-bold text-slate-900">
                                                    {f.title}
                                                </div>
                                                <div className="mt-2 text-base leading-relaxed text-slate-600">
                                                    {f.desc}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
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
                                            Find your tutor.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            We’ll connect you with a tutor who motivates, challenges, and supports you — from first lesson to fluency.
                                        </div>

                                        <div className="relative mt-10 h-44">
                                            <div className="absolute left-0 top-2 w-56 border border-slate-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-slate-100"></div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-base font-semibold text-slate-900">
                                                            Milena
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
                                                            Bassel
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
                                                            Sophia
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
                                            Start learning.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            Your tutor will tailor every lesson to your learning goals, so progress feels personal from the very beginning.
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
                                            Make progress every week.
                                        </div>
                                        <div className="mt-4 text-base leading-relaxed text-slate-700">
                                            Choose how many lessons you want to take and build lasting confidence, one conversation at a time.
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
                                    <Link href={route('tutors.index')} className="hover:text-white">
                                        Find tutors
                                    </Link>
                                    <a href="#how-it-works" className="hover:text-white">
                                        How it works
                                    </a>
                                    <a href="#subjects" className="hover:text-white">
                                        Subjects
                                    </a>
                                    <Link href={route('reviews.index')} className="hover:text-white">
                                        Reviews
                                    </Link>
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
