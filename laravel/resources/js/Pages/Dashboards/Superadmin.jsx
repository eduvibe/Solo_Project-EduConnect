import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function SuperadminDashboard() {
    const overview = usePage().props.overview || {};
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
                        <div className="mt-6 grid gap-4 sm:grid-cols-4">
                            <Link href={route('dashboard.superadmin.verifications')} className="dash-surface p-4">
                                <div className="dash-muted text-xs font-semibold">Pending verifications</div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    {Number(overview.pending_verifications || 0)}
                                </div>
                            </Link>
                            <Link href={route('dashboard.superadmin.payments')} className="dash-surface p-4">
                                <div className="dash-muted text-xs font-semibold">Pending payments</div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    {Number(overview.pending_payments || 0)}
                                </div>
                            </Link>
                            <Link href={route('dashboard.superadmin.wallet-fundings')} className="dash-surface p-4">
                                <div className="dash-muted text-xs font-semibold">Wallet top-ups</div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    {Number(overview.pending_wallet_topups || 0)}
                                </div>
                            </Link>
                            <Link href={route('dashboard.superadmin.payouts')} className="dash-surface p-4">
                                <div className="dash-muted text-xs font-semibold">Pending payouts</div>
                                <div className="dash-title mt-2 text-2xl font-bold">
                                    {Number(overview.pending_payouts || 0)}
                                </div>
                            </Link>
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
                        <div className="dash-title text-sm font-semibold">Shortcuts</div>
                        <div className="mt-4 grid gap-3">
                            <Link href={route('dashboard.superadmin.payments')} className="dash-surface p-4 text-sm font-semibold">
                                Payment confirmations
                            </Link>
                            <Link href={route('dashboard.superadmin.wallet-fundings')} className="dash-surface p-4 text-sm font-semibold">
                                Wallet top-ups
                            </Link>
                            <Link href={route('dashboard.superadmin.payouts')} className="dash-surface p-4 text-sm font-semibold">
                                Payout requests
                            </Link>
                            <Link href={route('admin.users')} className="dash-surface p-4 text-sm font-semibold">
                                User management
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
