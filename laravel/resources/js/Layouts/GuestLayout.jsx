import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 pt-10 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 text-brand-700" />
                </Link>
                <div className="mt-3 text-lg font-semibold text-slate-900">
                    EduConnect
                </div>
                <div className="text-sm text-slate-500">
                    Sign in to continue
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
