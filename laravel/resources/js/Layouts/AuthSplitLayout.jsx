import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, usePage } from '@inertiajs/react';

function SideIllustration() {
    return (
        <div className="relative hidden overflow-hidden bg-[#0b2a29] lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-40">
                <svg viewBox="0 0 800 800" className="h-full w-full">
                    <defs>
                        <linearGradient id="authWave" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#9dff52" stopOpacity="0.35" />
                            <stop offset="55%" stopColor="#1d4746" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
                        </linearGradient>
                    </defs>
                    <rect width="800" height="800" fill="url(#authWave)" />
                    <path
                        d="M-40 110c140 70 220 40 360-30S610-40 860 80v150c-220 150-360 160-520 90S120 250-40 340V110z"
                        fill="#9dff52"
                        opacity="0.18"
                    />
                    <path
                        d="M-60 450c200-120 320-120 520 0s320 120 520 0v220c-210 110-360 110-520 0S120 560-60 670V450z"
                        fill="#ffffff"
                        opacity="0.08"
                    />
                    <path
                        d="M-40 720c170-80 280-60 450 30s290 90 450 10v120H-40V720z"
                        fill="#9dff52"
                        opacity="0.12"
                    />
                </svg>
            </div>

            <div className="relative px-10 pt-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/15">
                    Secure access
                </div>
            </div>

            <div className="relative px-10 pb-12">
                <div className="relative overflow-hidden rounded-3xl bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#9dff52]/30 blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/30 blur-2xl" />

                    <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="flex h-44 w-44 items-center justify-center rounded-3xl bg-black/20 ring-1 ring-white/15">
                            <svg viewBox="0 0 160 160" className="h-32 w-32">
                                <rect x="46" y="40" width="68" height="88" rx="18" fill="#ffffff" opacity="0.95" />
                                <rect x="56" y="52" width="48" height="10" rx="5" fill="#0b2a29" opacity="0.75" />
                                <rect x="56" y="70" width="42" height="8" rx="4" fill="#0b2a29" opacity="0.35" />
                                <rect x="56" y="84" width="36" height="8" rx="4" fill="#0b2a29" opacity="0.25" />
                                <path
                                    d="M70 124c4 7 10 11 18 11 9 0 16-6 18-15l2-11c2-12-6-23-18-23-9 0-15 5-18 14l-2 8c-2 8-1 12 0 16z"
                                    fill="#9dff52"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>

                        <div className="mt-7 text-center">
                            <div className="text-lg font-semibold text-white">Book and learn faster</div>
                            <div className="mt-2 text-sm text-white/70">
                                Fund your wallet, schedule lessons, and track confirmations in one place.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-sm text-white/70">
                    © {new Date().getFullYear()} EduConnect
                </div>
            </div>

            <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 ring-1 ring-white/15" />
            <div className="pointer-events-none absolute -bottom-12 -right-10 h-28 w-28 rounded-full bg-white/10 ring-1 ring-white/15" />
        </div>
    );
}

export default function AuthSplitLayout({ title, subtitle, children, headTitle, status }) {
    const page = usePage();
    const banner = status || page.props?.status;

    return (
        <>
            <Head title={headTitle || title || 'Auth'} />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-[#9dff52]/20 px-4 py-10">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
                    <div className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid lg:grid-cols-2">
                        <div className="relative px-8 py-10 sm:px-10">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <ApplicationLogo className="h-10 w-10 text-black" />
                                <div className="leading-tight">
                                    <div className="text-base font-semibold text-slate-900">EduConnect</div>
                                    <div className="text-sm text-slate-500">Parents • Tutors • Admin</div>
                                </div>
                            </Link>

                            <div className="mt-10">
                                <div className="text-2xl font-bold text-slate-900">{title}</div>
                                {subtitle && <div className="mt-2 text-sm text-slate-600">{subtitle}</div>}
                            </div>

                            {banner && (
                                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                                    {banner}
                                </div>
                            )}

                            <div className="mt-8">{children}</div>
                        </div>

                        <SideIllustration />

                        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200">
                                <div className="h-6 w-6 rounded-full bg-[#9dff52]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
