import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function SuperadminDashboard() {
    return (
        <DashboardLayout title="Superadmin Dashboard">
            <Head title="Superadmin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-2xl font-bold">
                            Platform controls
                        </div>
                        <div className="dash-muted mt-2 text-sm">
                            User roles, governance, and platform-wide settings.
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={route('dashboard.superadmin.teachers')}
                                className="dash-btn-neutral inline-flex items-center px-5 py-3 text-base"
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
                                className="dash-btn-neutral inline-flex items-center px-5 py-3 text-base"
                            >
                                Browse tutors
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">
                            Quick actions
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Audit logs
                            </div>
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Payout settings
                            </div>
                            <div className="dash-surface p-4 text-sm font-semibold">
                                Platform settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
