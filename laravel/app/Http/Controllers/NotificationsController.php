<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = [];

        if (Schema::hasTable('simple_notifications')) {
            $notifications = DB::table('simple_notifications')
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->take(50)
                ->get();
        }

        return Inertia::render('Dashboards/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markAllRead(Request $request)
    {
        $user = $request->user();
        if (Schema::hasTable('simple_notifications')) {
            DB::table('simple_notifications')
                ->where('user_id', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return back()->with('status', 'Notifications cleared.');
    }
}

