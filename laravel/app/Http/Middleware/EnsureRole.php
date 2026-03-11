<?php

namespace App\Http\Middleware;

use Closure;
use App\Support\RoleDashboard;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        $role = $user ? (string) $user->role : '';

        if (! $user) {
            return redirect()->route('login');
        }

        if ($role === 'superadmin') {
            $impersonate = (string) $request->session()->get('impersonate_role', '');
            if (in_array($impersonate, ['parent', 'teacher'], true)) {
                $role = $impersonate;
            }
        }

        if (in_array($role, $roles, true)) {
            return $next($request);
        }

        return redirect(RoleDashboard::path($role));
    }
}
