import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function SuperadminDashboard() {
    return (
        <DashboardLayout title="Superadmin Dashboard">
            <Head title="Superadmin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-2xl font-bold text-slate-900">
                            Platform controls
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                            User roles, governance, and platform-wide settings.
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={route('admin.users')}
                                className="inline-flex items-center rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                            >
                                Manage users
                            </Link>
                            <Link
                                href={route('tutors.index')}
                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                                Browse tutors
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Audit logs
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Payout settings
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
