import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AvailabilityForm from './Partials/AvailabilityForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import TutorProfileForm from './Partials/TutorProfileForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import VerificationForm from './Partials/VerificationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const effectiveRole = String(usePage().props.impersonation?.activeRole || user?.role || '').toLowerCase();
    const isTutor = effectiveRole === 'teacher';
    const tabs = useMemo(() => {
        const base = [
            { key: 'account', label: 'Account' },
        ];
        if (isTutor) {
            base.push({ key: 'tutor', label: 'Tutor profile' });
            base.push({ key: 'availability', label: 'Availability' });
            base.push({ key: 'verification', label: 'Verification' });
        }
        base.push({ key: 'security', label: 'Security' });
        return base;
    }, [isTutor]);

    const [active, setActive] = useState(tabs[0]?.key || 'account');

    return (
        <DashboardLayout title="Profile">
            <Head title="Profile" />

            <div className="dash-surface p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="dash-title text-lg font-semibold">Manage your profile</div>
                        <div className="dash-muted mt-1 text-sm">
                            Update your details in short steps. Works well on mobile.
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setActive(t.key)}
                            className={
                                'px-4 py-2 text-sm font-semibold ' +
                                (active === t.key ? 'bg-[#9dff52] text-black' : 'dash-surface dash-title')
                            }
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="dash-surface mt-6 p-4 sm:p-6">
                {active === 'account' && (
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-3xl"
                    />
                )}

                {active === 'tutor' && isTutor && <TutorProfileForm className="max-w-4xl" />}
                {active === 'availability' && isTutor && <AvailabilityForm className="max-w-4xl" />}
                {active === 'verification' && isTutor && <VerificationForm className="max-w-4xl" />}

                {active === 'security' && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="p-0">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                        <div className="p-0">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
