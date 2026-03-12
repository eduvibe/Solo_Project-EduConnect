import { useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function TutorProfileForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const categories = usePage().props.categories || [];
    const selectedCategoryIds = usePage().props.selectedCategoryIds || [];

    const { data, setData, patch, processing, errors } = useForm({
        profile_summary: user.profile_summary || '',
        location: user.location || '',
        hourly_rate: user.hourly_rate_cents ? String(user.hourly_rate_cents / 100) : '',
        phone: user.phone || '',
        linkedin_url: user.linkedin_url || '',
        x_url: user.x_url || '',
        tiktok_url: user.tiktok_url || '',
        facebook_url: user.facebook_url || '',
        categories: selectedCategoryIds,
    });

    const toggleCategory = (id) => {
        setData('categories', data.categories.includes(id) ? data.categories.filter((x) => x !== id) : [...data.categories, id]);
    };

    const canSubmit = useMemo(() => true, []);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.tutor.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className={className}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <div className="dash-title text-sm font-semibold">Profile summary</div>
                    <div className="dash-muted mt-1 text-sm">Write a short intro that helps parents understand your strengths.</div>
                    <textarea
                        value={data.profile_summary}
                        onChange={(e) => setData('profile_summary', e.target.value)}
                        rows={5}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="I teach Mathematics for JSS/SSS learners. My sessions focus on fundamentals, practice, and exam confidence."
                    />
                    {errors.profile_summary && <div className="mt-2 text-sm text-red-600">{errors.profile_summary}</div>}
                </div>

                <div>
                    <div className="dash-title text-sm font-semibold">Location</div>
                    <div className="dash-muted mt-1 text-sm">City/State to help match you with nearby parents.</div>
                    <input
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="Lagos, Nigeria"
                    />
                    {errors.location && <div className="mt-2 text-sm text-red-600">{errors.location}</div>}
                </div>

                <div>
                    <div className="dash-title text-sm font-semibold">Hourly rate (₦/hr)</div>
                    <div className="dash-muted mt-1 text-sm">Your base rate. Agreements can define final terms.</div>
                    <input
                        value={data.hourly_rate}
                        onChange={(e) => setData('hourly_rate', e.target.value)}
                        inputMode="decimal"
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="5000"
                    />
                    {errors.hourly_rate && <div className="mt-2 text-sm text-red-600">{errors.hourly_rate}</div>}
                </div>

                <div>
                    <div className="dash-title text-sm font-semibold">Phone number</div>
                    <div className="dash-muted mt-1 text-sm">Displayed only to parents you have an agreement with.</div>
                    <input
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="+234..."
                    />
                    {errors.phone && <div className="mt-2 text-sm text-red-600">{errors.phone}</div>}
                </div>

                <div>
                    <div className="dash-title text-sm font-semibold">LinkedIn</div>
                    <input
                        value={data.linkedin_url}
                        onChange={(e) => setData('linkedin_url', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedin_url && <div className="mt-2 text-sm text-red-600">{errors.linkedin_url}</div>}
                </div>
                <div>
                    <div className="dash-title text-sm font-semibold">X (Twitter)</div>
                    <input
                        value={data.x_url}
                        onChange={(e) => setData('x_url', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="https://x.com/..."
                    />
                    {errors.x_url && <div className="mt-2 text-sm text-red-600">{errors.x_url}</div>}
                </div>
                <div>
                    <div className="dash-title text-sm font-semibold">TikTok</div>
                    <input
                        value={data.tiktok_url}
                        onChange={(e) => setData('tiktok_url', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="https://tiktok.com/@..."
                    />
                    {errors.tiktok_url && <div className="mt-2 text-sm text-red-600">{errors.tiktok_url}</div>}
                </div>
                <div>
                    <div className="dash-title text-sm font-semibold">Facebook</div>
                    <input
                        value={data.facebook_url}
                        onChange={(e) => setData('facebook_url', e.target.value)}
                        className="dash-input mt-3 w-full p-3 text-sm"
                        placeholder="https://facebook.com/..."
                    />
                    {errors.facebook_url && <div className="mt-2 text-sm text-red-600">{errors.facebook_url}</div>}
                </div>

                <div className="sm:col-span-2">
                    <div className="dash-title text-sm font-semibold">Subjects</div>
                    <div className="dash-muted mt-1 text-sm">Select what you teach. You can update this anytime.</div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {categories.map((c) => (
                            <label key={c.id} className="dash-muted-strong flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.categories.includes(c.id)}
                                    onChange={() => toggleCategory(c.id)}
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>
                    {errors.categories && <div className="mt-2 text-sm text-red-600">{errors.categories}</div>}
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={!canSubmit || processing}
                    className="dash-btn-green px-5 py-2"
                >
                    Save tutor profile
                </button>
            </div>
        </form>
    );
}
