import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthSplitLayout
            title="Login"
            subtitle="Welcome back. Sign in to continue."
            headTitle="Log in"
            status={status}
        >
            <Head title="Log in" />

            <form onSubmit={submit} className="space-y-5">
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
                            autoFocus
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="name@email.com"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
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
                            autoComplete="current-password"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9dff52] focus:ring-2 focus:ring-[#9dff52]/40"
                            placeholder="Your password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Remember me
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#9dff52] px-5 py-3 text-base font-semibold text-black shadow-sm transition hover:opacity-90 disabled:opacity-60"
                >
                    Sign in
                </button>

                <div className="text-center text-sm text-slate-600">
                    New to EduConnect?{' '}
                    <Link href={route('register')} className="font-semibold text-slate-900 underline decoration-[#9dff52] underline-offset-4">
                        Create an account
                    </Link>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
