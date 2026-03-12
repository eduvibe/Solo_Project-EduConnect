import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Tutors({ filters }) {
    const auth = usePage().props.auth;
    const isAuthed = Boolean(auth?.user);

    const [subject, setSubject] = useState(filters?.subject || '');
    const [level, setLevel] = useState(filters?.level || 'jss');
    const [mode, setMode] = useState(filters?.mode || 'online');
    const [city, setCity] = useState(filters?.city || 'any');
    const [recommendOpen, setRecommendOpen] = useState(false);
    const [recommendStep, setRecommendStep] = useState(0);
    const [recommendView, setRecommendView] = useState(false);
    const [recommendAnswers, setRecommendAnswers] = useState({
        topic: '',
        mode: 'online',
        city: 'any',
        tags: [],
    });
    const resultsRef = useRef(null);

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

    const recommendedResults = useMemo(() => {
        if (!recommendView) return [];

        const topic = String(recommendAnswers.topic || '').trim().toLowerCase();
        const recMode = String(recommendAnswers.mode || 'online');
        const recCity = String(recommendAnswers.city || 'any');
        const wantedTags = new Set(
            (recommendAnswers.tags || []).map((t) => String(t).toLowerCase()),
        );

        const scored = tutors
            .map((t) => {
                let score = 0;
                const subjectHit =
                    topic === ''
                        ? false
                        : t.subjects.some((s) =>
                              s.toLowerCase().includes(topic),
                          );
                if (subjectHit) score += 60;

                if (t.modes.includes(recMode)) score += 20;

                if (recCity === 'any') score += 4;
                else if (t.city === recCity) score += 16;

                for (const tag of t.tags || []) {
                    if (wantedTags.has(String(tag).toLowerCase())) score += 6;
                }

                score += Math.round((t.rating || 0) * 4);
                score += Math.min(20, Math.floor((t.lessons || 0) / 20));

                return { tutor: t, score };
            })
            .filter(({ tutor }) => {
                if (String(recommendAnswers.mode || 'online') === '') return true;
                return tutor.modes.includes(recMode);
            })
            .sort((a, b) => b.score - a.score);

        return scored.map((x) => x.tutor);
    }, [recommendView, recommendAnswers, tutors]);

    const displayedResults = recommendView ? recommendedResults : results;

    const topicPresets = useMemo(
        () => [
            'English',
            'Mathematics',
            'Coding',
            'IELTS',
            'Physics',
            'Chemistry',
            'Yorùbá',
            'Igbo',
        ],
        [],
    );

    const tagPresets = useMemo(
        () => [
            'WAEC',
            'NECO',
            'UTME',
            'IELTS',
            'Projects',
            'Conversation',
            'Writing',
        ],
        [],
    );

    const openRecommend = () => {
        setRecommendStep(0);
        setRecommendAnswers({
            topic: subject || '',
            mode: mode || 'online',
            city: city || 'any',
            tags: [],
        });
        setRecommendOpen(true);
    };

    const closeRecommend = () => {
        setRecommendOpen(false);
    };

    const nextRecommend = () => {
        setRecommendStep((s) => Math.min(3, s + 1));
    };

    const prevRecommend = () => {
        setRecommendStep((s) => Math.max(0, s - 1));
    };

    const finishRecommend = () => {
        setSubject(recommendAnswers.topic || '');
        setMode(recommendAnswers.mode || 'online');
        setCity(recommendAnswers.city || 'any');
        setRecommendView(true);
        setRecommendOpen(false);
        window.setTimeout(() => {
            resultsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 50);
    };

    useEffect(() => {
        if (!recommendView) return;
        setRecommendView(false);
    }, [subject, city, mode, level]);

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
            <div className="min-h-screen bg-white text-[18px] text-slate-900">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-brand-700" />
                            <div className="leading-tight">
                                <div className="text-base font-semibold text-slate-900">
                                    EduConnect
                                </div>
                                <div className="text-sm text-slate-500">
                                    Find a tutor
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {!isAuthed && (
                                <Link
                                    href={route('register', { role: 'teacher' })}
                                    className="hidden border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-900 md:inline-flex"
                                >
                                    Become a tutor
                                </Link>
                            )}
                            <Link
                                href={isAuthed ? route('dashboard') : route('login')}
                                className="border border-slate-200 bg-slate-900 px-4 py-2 text-base font-semibold text-white"
                            >
                                {isAuthed ? 'Dashboard' : 'Sign in'}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-10">
                    <div className="grid gap-6 lg:grid-cols-12">
                        <aside className="lg:col-span-4">
                            <div className="border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-base font-semibold text-slate-900">
                                    Filters
                                </div>

                                <form onSubmit={submit} className="mt-4 space-y-4">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-600">
                                            Subject
                                        </div>
                                        <input
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Mathematics"
                                            className="mt-2 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold text-slate-600">
                                            Level
                                        </div>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="mt-2 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
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
                                        <div className="text-sm font-semibold text-slate-600">
                                            City
                                        </div>
                                        <select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="mt-2 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
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
                                        <div className="text-sm font-semibold text-slate-600">
                                            Mode
                                        </div>
                                        <select
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value)}
                                            className="mt-2 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        >
                                            <option value="online">Online</option>
                                            <option value="in_person">In-person</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center bg-black px-4 py-3 text-base font-semibold text-white"
                                    >
                                        Apply filters
                                    </button>

                                    <button
                                        type="button"
                                        onClick={openRecommend}
                                        className="inline-flex w-full items-center justify-center border border-slate-200 bg-[#9dff52] px-4 py-3 text-base font-semibold text-black hover:opacity-90"
                                    >
                                        Recommend for me
                                    </button>

                                    {recommendView && (
                                        <button
                                            type="button"
                                            onClick={() => setRecommendView(false)}
                                            className="inline-flex w-full items-center justify-center border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900"
                                        >
                                            Clear recommendation
                                        </button>
                                    )}
                                </form>
                            </div>
                        </aside>

                        <section className="lg:col-span-8">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">
                                        Tutors you can book
                                    </h1>
                                    <div className="mt-1 text-base text-slate-600">
                                        {displayedResults.length} result{displayedResults.length === 1 ? '' : 's'}
                                    </div>
                                </div>
                            </div>

                            <div ref={resultsRef} className="mt-6 space-y-4">
                                {recommendView && (
                                    <div className="border border-slate-200 bg-white p-4 text-base text-slate-700">
                                        Recommended picks based on your answers.
                                    </div>
                                )}

                                {displayedResults.map((t) => (
                                    <div
                                        key={t.name}
                                        className="border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center bg-[#9dff52] text-base font-bold text-black">
                                                    {t.name
                                                        .split(' ')
                                                        .slice(0, 2)
                                                        .map((p) => p[0])
                                                        .join('')}
                                                </div>
                                                <div>
                                                    <div className="text-base font-semibold text-slate-900">
                                                        {t.name}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-500">
                                                        {t.subjects.join(', ')} • {t.city} •{' '}
                                                        {t.modes.includes('in_person')
                                                            ? 'Online & In-person'
                                                            : 'Online'}
                                                    </div>
                                                    {(t.linkedin_url || t.x_url || t.tiktok_url || t.facebook_url) && (
                                                        <div className="mt-3 flex items-center gap-3 text-slate-700">
                                                            {t.linkedin_url && (
                                                                <a
                                                                    href={t.linkedin_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-sm font-semibold underline"
                                                                >
                                                                    LinkedIn
                                                                </a>
                                                            )}
                                                            {t.x_url && (
                                                                <a
                                                                    href={t.x_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-sm font-semibold underline"
                                                                >
                                                                    X
                                                                </a>
                                                            )}
                                                            {(t.tiktok_url || t.facebook_url) && (
                                                                <a
                                                                    href={t.tiktok_url || t.facebook_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-sm font-semibold underline"
                                                                >
                                                                    {t.tiktok_url ? 'TikTok' : 'Facebook'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {t.tags.slice(0, 4).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                                <div className="border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                                                    {t.rating} ★ • {t.lessons} lessons
                                                </div>
                                                <div className="text-base font-semibold text-slate-900">
                                                    ₦{t.price.toLocaleString()}
                                                    <span className="text-slate-500">
                                                        {' '}
                                                        / hour
                                                    </span>
                                                </div>
                                                <Link
                                                    href={isAuthed ? route('dashboard') : route('login')}
                                                    className="inline-flex items-center justify-center bg-black px-4 py-2 text-base font-semibold text-white"
                                                >
                                                    Book lesson
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {displayedResults.length === 0 && (
                                    <div className="border border-slate-200 bg-slate-50 p-6 text-base text-slate-700">
                                        No tutors match those filters yet. Try a different city or switch to online.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {recommendOpen && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={closeRecommend}
                        />
                        <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                                <div>
                                    <div className="text-base font-semibold text-slate-900">
                                        Tutor recommendations
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        Question {recommendStep + 1} of 4
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeRecommend}
                                    className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-900"
                                    aria-label="Close"
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
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 py-6">
                                {recommendStep === 0 && (
                                    <div>
                                        <div className="text-xl font-bold text-slate-900">
                                            What do you want help with?
                                        </div>
                                        <div className="mt-3 text-base text-slate-600">
                                            Pick a topic or type your own.
                                        </div>
                                        <input
                                            value={recommendAnswers.topic}
                                            onChange={(e) =>
                                                setRecommendAnswers((p) => ({
                                                    ...p,
                                                    topic: e.target.value,
                                                }))
                                            }
                                            placeholder="e.g. Cyber security, WAEC Maths, IELTS"
                                            className="mt-5 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        />
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {topicPresets.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() =>
                                                        setRecommendAnswers((p) => ({
                                                            ...p,
                                                            topic: t,
                                                        }))
                                                    }
                                                    className="border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900"
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recommendStep === 1 && (
                                    <div>
                                        <div className="text-xl font-bold text-slate-900">
                                            How do you want to learn?
                                        </div>
                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                            {[
                                                { value: 'online', label: 'Online' },
                                                { value: 'in_person', label: 'In-person' },
                                            ].map((o) => (
                                                <button
                                                    key={o.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setRecommendAnswers((p) => ({
                                                            ...p,
                                                            mode: o.value,
                                                        }))
                                                    }
                                                    className={
                                                        'border px-4 py-4 text-left ' +
                                                        (recommendAnswers.mode === o.value
                                                            ? 'border-black bg-[#9dff52] text-black'
                                                            : 'border-slate-200 bg-white text-slate-900')
                                                    }
                                                >
                                                    <div className="text-base font-semibold">
                                                        {o.label}
                                                    </div>
                                                    <div className="mt-1 text-sm opacity-80">
                                                        {o.value === 'online'
                                                            ? 'Learn from anywhere.'
                                                            : 'Meet in your city.'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recommendStep === 2 && (
                                    <div>
                                        <div className="text-xl font-bold text-slate-900">
                                            Where are you located?
                                        </div>
                                        <div className="mt-3 text-base text-slate-600">
                                            Choose a city to prioritize local matches.
                                        </div>
                                        <select
                                            value={recommendAnswers.city}
                                            onChange={(e) =>
                                                setRecommendAnswers((p) => ({
                                                    ...p,
                                                    city: e.target.value,
                                                }))
                                            }
                                            className="mt-5 w-full border-slate-300 text-base shadow-sm focus:border-brand-500 focus:ring-brand-500"
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
                                )}

                                {recommendStep === 3 && (
                                    <div>
                                        <div className="text-xl font-bold text-slate-900">
                                            What are you working towards?
                                        </div>
                                        <div className="mt-3 text-base text-slate-600">
                                            Select any that apply.
                                        </div>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {tagPresets.map((tag) => {
                                                const selected = (
                                                    recommendAnswers.tags || []
                                                ).includes(tag);
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() =>
                                                            setRecommendAnswers((p) => {
                                                                const current = new Set(
                                                                    p.tags || [],
                                                                );
                                                                if (current.has(tag)) {
                                                                    current.delete(tag);
                                                                } else {
                                                                    current.add(tag);
                                                                }
                                                                return {
                                                                    ...p,
                                                                    tags: Array.from(current),
                                                                };
                                                            })
                                                        }
                                                        className={
                                                            'border px-3 py-2 text-base font-semibold ' +
                                                            (selected
                                                                ? 'border-black bg-[#9dff52] text-black'
                                                                : 'border-slate-200 bg-white text-slate-900')
                                                        }
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-6 border border-slate-200 bg-slate-50 p-4 text-base text-slate-700">
                                            We’ll prioritize tutors that match your topic, preferred mode, city, and selected goals.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={prevRecommend}
                                    className="border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-900 disabled:opacity-40"
                                    disabled={recommendStep === 0}
                                >
                                    Back
                                </button>

                                {recommendStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextRecommend}
                                        className="bg-black px-5 py-2 text-base font-semibold text-white"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={finishRecommend}
                                        className="bg-black px-5 py-2 text-base font-semibold text-white"
                                    >
                                        Show recommendations
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
