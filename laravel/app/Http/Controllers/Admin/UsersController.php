<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->trim()->value();
        $role = $request->string('role')->trim()->value();
        $allowedRoles = ['parent', 'teacher', 'admin', 'superadmin'];
        if (! in_array($role, $allowedRoles, true)) {
            $role = '';
        }

        $users = User::query()
            ->when($role !== '', function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at ? $user->created_at->toDateTimeString() : null,
                ];
            });

        return Inertia::render('Admin/Users', [
            'filters' => [
                'q' => $search,
                'role' => $role,
            ],
            'users' => $users,
        ]);
    }

    public function teachers(Request $request): Response
    {
        $request->merge(['role' => 'teacher']);

        return $this->index($request);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['parent', 'teacher', 'admin', 'superadmin'])],
        ]);

        $role = $validated['role'];

        if ($request->user() && $request->user()->id === $user->id && $role !== 'superadmin') {
            return back()->withErrors([
                'role' => 'You cannot remove your own superadmin role.',
            ]);
        }

        $user->role = $role;
        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
        }
        $user->save();

        return back()->with('status', 'User role updated.');
    }
}
