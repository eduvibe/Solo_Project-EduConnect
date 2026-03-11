import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Reviews() {
    const auth = usePage().props.auth;
    const isAuthed = Boolean(auth?.user);

    return (
        <>
            <Head title="Reviews" />
            <div className="min-h-screen bg-white text-[18px] text-slate-900">
                <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 text-white backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-white" />
                            <div className="text-base font-semibold text-white">
                                EduConnect
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Link
                                href={route('tutors.index')}
                                className="hidden px-4 py-2 text-base font-semibold text-white/85 hover:text-white md:inline-flex"
                            >
                                Find tutors
                            </Link>
                            <Link
                                href={isAuthed ? route('dashboard') : route('login')}
                                className="rounded-lg bg-[#9dff52] px-4 py-2 text-base font-semibold text-black hover:opacity-90"
                            >
                                {isAuthed ? 'Dashboard' : 'Sign in'}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-16">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Reviews
                        </h1>
                        <p className="max-w-2xl text-base text-slate-600">
                            Feedback from learners and parents across Nigeria.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 lg:grid-cols-3">
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
                            <div
                                key={t.name}
                                className="border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="text-base leading-relaxed text-slate-700">
                                    “{t.quote}”
                                </div>
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="text-base font-semibold text-slate-900">
                                        {t.name}
                                    </div>
                                    <div className="text-sm font-semibold text-[#9dff52]">
                                        Verified
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-base font-semibold text-slate-900"
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
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </span>
                            Back to home
                        </Link>
                    </div>
                </main>

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
                                    Learn with clarity and consistency. Find tutors for school subjects and modern skills.
                                </div>
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
                                            <Link
                                                href="/"
                                                className="block hover:text-white"
                                            >
                                                Home
                                            </Link>
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
                                                {isAuthed ? 'Open dashboard' : 'Sign in'}
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-white/70">
                                            Company
                                        </div>
                                        <div className="mt-4 space-y-3 text-base text-white/70">
                                            <a href="#" className="block hover:text-white">
                                                About
                                            </a>
                                            <a href="#" className="block hover:text-white">
                                                Terms
                                            </a>
                                            <a href="#" className="block hover:text-white">
                                                Privacy
                                            </a>
                                            <a href="#" className="block hover:text-white">
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
            </div>
        </>
    );
}
