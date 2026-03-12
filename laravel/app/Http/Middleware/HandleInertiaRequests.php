<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
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

        $unreadMessages = 0;
        $unreadNotifications = 0;
        if ($user) {
            if (Schema::hasTable('messages')) {
                $unreadMessages = (int) DB::table('messages')
                    ->where('to_user_id', $user->id)
                    ->whereNull('read_at')
                    ->count();
            }
            if (Schema::hasTable('simple_notifications')) {
                $unreadNotifications = (int) DB::table('simple_notifications')
                    ->where('user_id', $user->id)
                    ->whereNull('read_at')
                    ->count();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'impersonation' => [
                'can' => $canImpersonate,
                'activeRole' => $activeRole,
            ],
            'counts' => [
                'unreadMessages' => $unreadMessages,
                'unreadNotifications' => $unreadNotifications,
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
