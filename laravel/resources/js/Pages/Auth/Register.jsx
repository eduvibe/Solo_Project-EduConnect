import InputError from '@/Components/InputError';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'parent',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const role = new URLSearchParams(window.location.search).get('role');
        if (role === 'teacher' || role === 'parent') {
            setData('role', role);
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSplitLayout
            title="Create account"
            subtitle="Join EduConnect and start booking lessons."
            headTitle="Register"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <div className="text-sm font-semibold text-slate-700">Full name</div>
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21a8 8 0 10-16 0" />
                                <path d="M12 13a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </div>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="name"
                            required
                            autoFocus
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="Your name"
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-slate-700">Email</div>
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16v16H4z" stroke="none" />
                                <path d="M4 6l8 7 8-7" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="name@email.com"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-slate-700">Account type</div>
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3l9 6-9 6-9-6 9-6z" />
                                <path d="M3 15l9 6 9-6" />
                            </svg>
                        </div>
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                        >
                            <option value="parent">Parent</option>
                            <option value="teacher">Tutor</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-slate-700">Password</div>
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 11V8a5 5 0 0110 0v3" />
                                <path d="M6 11h12v10H6z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="Create a password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-slate-700">Confirm password</div>
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4" />
                                <path d="M7 11V8a5 5 0 0110 0v3" />
                                <path d="M6 11h12v10H6z" />
                            </svg>
                        </div>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="Repeat password"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#9dff52] px-5 py-3 text-base font-semibold text-black shadow-sm transition hover:opacity-90 disabled:opacity-60"
                >
                    Create account
                </button>

                <div className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href={route('login')} className="font-semibold text-slate-900 underline decoration-[#9dff52] underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
