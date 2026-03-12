import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function SuperadminDashboard() {
    return (
        <DashboardLayout title="Superadmin Dashboard">
            <Head title="Superadmin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="text-2xl font-bold text-white">
                            Platform controls
                        </div>
                        <div className="mt-2 text-sm text-white/60">
                            User roles, governance, and platform-wide settings.
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={route('dashboard.superadmin.teachers')}
                                className="dash-btn-black inline-flex items-center px-5 py-3 text-base"
                            >
                                Teachers
                            </Link>
                            <Link
                                href={route('admin.users')}
                                className="dash-btn-green inline-flex items-center px-5 py-3 text-base"
                            >
                                Manage users
                            </Link>
                            <Link
                                href={route('tutors.index')}
                                className="inline-flex items-center border border-white/10 bg-black px-5 py-3 text-base font-semibold text-white"
                            >
                                Browse tutors
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="text-sm font-semibold text-white">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Audit logs
                            </div>
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Payout settings
                            </div>
                            <div className="border border-white/10 bg-black p-4 text-sm font-semibold text-white">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
