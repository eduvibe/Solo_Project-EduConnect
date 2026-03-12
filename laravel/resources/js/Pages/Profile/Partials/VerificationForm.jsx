import { Link, router, useForm, usePage } from '@inertiajs/react';

function statusLabel(status) {
    const s = String(status || 'not_started').toLowerCase();
    if (s === 'approved') return 'Approved';
    if (s === 'pending') return 'In review';
    if (s === 'rejected') return 'Needs changes';
    return 'Not submitted';
}

export default function VerificationForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors } = useForm({
        avatar: null,
        id_document: null,
        certificate: null,
    });

    const upload = (e) => {
        e.preventDefault();
        post(route('profile.verification.upload'), { preserveScroll: true, forceFormData: true });
    };

    const submitForReview = () => {
        router.post(route('profile.verification.submit'), {}, { preserveScroll: true });
    };

    return (
        <div className={className}>
            <div className="text-sm font-semibold text-white">Verification</div>
            <div className="mt-1 text-sm text-white/60">
                Upload your photo and documents. After submission, we review and update your status.
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="text-sm font-semibold text-white">Status:</div>
                <div className="text-sm text-white/70">{statusLabel(user.verification_status)}</div>
                <div className="text-sm text-white/60">{user.verification_submitted_at || ''}</div>
            </div>

            <form onSubmit={upload} className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                    <div className="text-sm font-semibold text-white">Photo</div>
                    <div className="mt-1 text-sm text-white/60">JPG/PNG up to 2MB.</div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('avatar', e.target.files?.[0] || null)}
                        className="mt-3 block w-full text-sm text-white"
                    />
                    {errors.avatar && <div className="mt-2 text-sm text-red-600">{errors.avatar}</div>}
                    {user.avatar_path && (
                        <div className="mt-3 text-sm">
                            <a href={`/storage/${user.avatar_path}`} className="dash-link text-sm font-semibold">
                                View uploaded photo
                            </a>
                        </div>
                    )}
                </div>

                <div className="sm:col-span-1">
                    <div className="text-sm font-semibold text-white">ID document</div>
                    <div className="mt-1 text-sm text-white/60">PDF/JPG/PNG up to 5MB.</div>
                    <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setData('id_document', e.target.files?.[0] || null)}
                        className="mt-3 block w-full text-sm text-white"
                    />
                    {errors.id_document && <div className="mt-2 text-sm text-red-600">{errors.id_document}</div>}
                    {user.id_document_path && (
                        <div className="mt-3 text-sm">
                            <a href={`/storage/${user.id_document_path}`} className="dash-link text-sm font-semibold">
                                View uploaded ID
                            </a>
                        </div>
                    )}
                </div>

                <div className="sm:col-span-1">
                    <div className="text-sm font-semibold text-white">Certificate</div>
                    <div className="mt-1 text-sm text-white/60">PDF/JPG/PNG up to 5MB.</div>
                    <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setData('certificate', e.target.files?.[0] || null)}
                        className="mt-3 block w-full text-sm text-white"
                    />
                    {errors.certificate && <div className="mt-2 text-sm text-red-600">{errors.certificate}</div>}
                    {user.certificate_path && (
                        <div className="mt-3 text-sm">
                            <a href={`/storage/${user.certificate_path}`} className="dash-link text-sm font-semibold">
                                View uploaded certificate
                            </a>
                        </div>
                    )}
                </div>

                <div className="sm:col-span-3 flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="dash-btn-black px-5 py-2"
                    >
                        Upload files
                    </button>
                    <button
                        type="button"
                        onClick={submitForReview}
                        className="dash-btn-green px-5 py-2"
                    >
                        Submit for review
                    </button>
                    <Link href={route('profile.edit')} className="px-5 py-2 text-sm font-semibold text-white/70">
                        Refresh
                    </Link>
                </div>
            </form>
        </div>
    );
}
