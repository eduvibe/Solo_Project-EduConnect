<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class TutorProfileController extends Controller
{
    private function effectiveRole(Request $request): string
    {
        $user = $request->user();
        $role = $user ? (string) $user->role : '';
        if ($role === 'superadmin') {
            $impersonate = (string) $request->session()->get('impersonate_role', '');
            if (in_array($impersonate, ['parent', 'teacher'], true)) {
                $role = $impersonate;
            }
        }
        return $role;
    }

    public function updateTutorProfile(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $data = $request->validate([
            'profile_summary' => ['nullable', 'string', 'max:1500'],
            'location' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'phone' => ['nullable', 'string', 'max:50'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],
            'x_url' => ['nullable', 'string', 'max:255'],
            'tiktok_url' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'string', 'max:255'],
            'categories' => ['array'],
            'categories.*' => ['integer', 'exists:categories,id'],
        ]);

        $hourlyCents = isset($data['hourly_rate']) && $data['hourly_rate'] !== null
            ? (int) round(((float) $data['hourly_rate']) * 100)
            : (int) ($user->hourly_rate_cents ?? 0);

        $user->profile_summary = $data['profile_summary'] ?? null;
        $user->location = $data['location'] ?? null;
        $user->hourly_rate_cents = $hourlyCents;
        $user->phone = $data['phone'] ?? null;
        $user->linkedin_url = $data['linkedin_url'] ?? null;
        $user->x_url = $data['x_url'] ?? null;
        $user->tiktok_url = $data['tiktok_url'] ?? null;
        $user->facebook_url = $data['facebook_url'] ?? null;
        $user->save();

        if (Schema::hasTable('categories') && Schema::hasTable('category_user')) {
            $user->categories()->sync($data['categories'] ?? []);
        }

        return Redirect::route('profile.edit')->with('status', 'Tutor profile updated.');
    }

    public function updateAvailability(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $data = $request->validate([
            'availability' => ['nullable', 'array'],
        ]);

        $user->availability = $data['availability'] ?? null;
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Availability updated.');
    }

    public function uploadVerification(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $data = $request->validate([
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'id_document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'certificate' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $base = "verifications/{$user->id}";

        if (isset($data['avatar'])) {
            $user->avatar_path = $data['avatar']->storePublicly($base, 'public');
        }
        if (isset($data['id_document'])) {
            $user->id_document_path = $data['id_document']->storePublicly($base, 'public');
        }
        if (isset($data['certificate'])) {
            $user->certificate_path = $data['certificate']->storePublicly($base, 'public');
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Verification files uploaded.');
    }

    public function submitVerification(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $user->verification_status = 'pending';
        $user->verification_submitted_at = now();
        $user->verification_rejection_note = null;
        $user->verification_reviewed_by = null;
        $user->verification_reviewed_at = null;
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Verification submitted for review.');
    }
}
