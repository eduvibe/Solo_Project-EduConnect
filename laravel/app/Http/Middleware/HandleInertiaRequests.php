<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $impersonateRole = (string) $request->session()->get('impersonate_role', '');
        $canImpersonate = $user && (string) $user->role === 'superadmin';
        $activeRole = $canImpersonate && in_array($impersonateRole, ['parent', 'teacher'], true)
            ? $impersonateRole
            : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'impersonation' => [
                'can' => $canImpersonate,
                'activeRole' => $activeRole,
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
