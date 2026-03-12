import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Wallet() {
    const user = usePage().props.auth.user;
    const balanceKobo = Number(user?.wallet_balance_kobo || 0);
    const tx = usePage().props.transactions || [];

    return (
        <DashboardLayout title="Wallet">
            <Head title="Wallet" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <div className="dash-surface p-6">
                        <div className="dash-muted-strong text-sm font-semibold">Wallet balance</div>
                        <div className="dash-title mt-2 text-3xl font-bold">
                            ₦{Math.floor(balanceKobo / 100).toLocaleString()}
                        </div>
                        <div className="dash-muted mt-2 text-sm">
                            Balance is stored in kobo for accuracy.
                        </div>
                        <div className="mt-4">
                            <Link href={route('wallet.funding.create')} className="dash-btn-green inline-flex px-5 py-3 text-base">
                                Fund wallet
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="dash-surface p-6">
                        <div className="dash-title text-sm font-semibold">Transactions</div>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dash-table-head text-left text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-3 py-2">When</th>
                                        <th className="px-3 py-2">Type</th>
                                        <th className="px-3 py-2">Amount</th>
                                        <th className="px-3 py-2">Ref</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-divider">
                                    {tx.map((t) => (
                                        <tr key={t.id}>
                                            <td className="dash-muted px-3 py-3 text-sm">{t.created_at}</td>
                                            <td className="dash-title px-3 py-3 text-sm font-semibold">{t.type}</td>
                                            <td className="dash-muted px-3 py-3 text-sm">
                                                {t.amount_kobo >= 0 ? '+' : '-'}₦{Math.floor(Math.abs(t.amount_kobo) / 100).toLocaleString()}
                                            </td>
                                            <td className="dash-muted px-3 py-3 text-sm">{t.reference || '—'}</td>
                                        </tr>
                                    ))}
                                    {tx.length === 0 && (
                                        <tr>
                                            <td className="dash-muted px-3 py-6 text-sm" colSpan={4}>
                                                No transactions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
