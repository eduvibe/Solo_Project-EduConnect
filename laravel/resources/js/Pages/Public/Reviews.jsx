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
                            Trusted by parents
                        </h1>
                        <p className="max-w-2xl text-base text-slate-600">
                            Real outcomes, local context, consistent support.
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
                    <div className="mx-auto max-w-7xl px-6 py-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <ApplicationLogo className="h-9 w-9 text-white" />
                                <div className="text-base font-semibold text-white">
                                    EduConnect
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-base text-white/70">
                                <Link
                                    href={route('tutors.index')}
                                    className="hover:text-white"
                                >
                                    Find tutors
                                </Link>
                                <Link href="/" className="hover:text-white">
                                    Home
                                </Link>
                                <Link
                                    href={route('register', { role: 'teacher' })}
                                    className="hover:text-white"
                                >
                                    Become a tutor
                                </Link>
                            </div>
                        </div>
                        <div className="mt-8 text-sm text-white/60">
                            © {new Date().getFullYear()} EduConnect. Built for Nigerian tutors and parents.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

