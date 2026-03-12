<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SuperadminVerificationController extends Controller
{
    public function index(Request $request)
    {
        $pending = [];
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'verification_status')) {
            $pending = User::query()
                ->where('role', 'teacher')
                ->where('verification_status', 'pending')
                ->orderByDesc('verification_submitted_at')
                ->get([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'verification_status',
                    'verification_submitted_at',
                    'verification_rejection_note',
                    'avatar_path',
                    'id_document_path',
                    'certificate_path',
                    'location',
                ]);
        }

        return Inertia::render('Dashboards/SuperadminVerifications', [
            'teachers' => $pending,
        ]);
    }

    public function approve(Request $request, User $user)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);
        abort_unless((string) $user->role === 'teacher', 404);

        $user->verification_status = 'approved';
        $user->verification_reviewed_by = $request->user()->id;
        $user->verification_reviewed_at = now();
        $user->verification_rejection_note = null;
        $user->save();

        return back()->with('status', 'Tutor approved.');
    }

    public function reject(Request $request, User $user)
    {
        abort_unless((string) $request->user()->role === 'superadmin', 403);
        abort_unless((string) $user->role === 'teacher', 404);

        $data = $request->validate([
            'note' => ['required', 'string', 'max:2000'],
        ]);

        $user->verification_status = 'rejected';
        $user->verification_reviewed_by = $request->user()->id;
        $user->verification_reviewed_at = now();
        $user->verification_rejection_note = $data['note'];
        $user->save();

        return back()->with('status', 'Tutor rejected.');
    }
}

