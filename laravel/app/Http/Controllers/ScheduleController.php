<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\SimpleNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ScheduleController extends Controller
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

    public function index(Request $request)
    {
        $user = $request->user();
        $role = $this->effectiveRole($request);

        $schedules = [];
        if (Schema::hasTable('schedules')) {
            if ($role === 'teacher') {
                $schedules = Schedule::query()
                    ->where('teacher_id', $user->id)
                    ->with('attendees:id,name,email')
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $schedules = $user->belongsToMany(Schedule::class, 'schedule_user')->get();
            }
        }

        return Inertia::render('Dashboards/Schedules', [
            'role' => $role,
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:1000'],
            'day_of_week' => ['nullable', 'string', 'max:16'],
            'start_time' => ['nullable'],
            'recurring' => ['boolean'],
            'date' => ['nullable', 'date'],
            'invite_email' => ['nullable', 'email'],
        ]);

        $schedule = Schedule::create([
            'teacher_id' => $user->id,
            'title' => $data['title'],
            'link' => $data['link'] ?? null,
            'day_of_week' => $data['day_of_week'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'recurring' => (bool) ($data['recurring'] ?? false),
            'date' => $data['date'] ?? null,
        ]);

        if (!empty($data['invite_email'])) {
            $invitee = User::query()->where('email', $data['invite_email'])->first();
            if ($invitee) {
                $schedule->attendees()->syncWithoutDetaching([$invitee->id]);
                SimpleNotification::create([
                    'user_id' => $invitee->id,
                    'type' => 'schedule_invite',
                    'data' => ['title' => $schedule->title, 'from' => $user->name],
                ]);
            }
        }

        return back()->with('status', 'Schedule created');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:1000'],
            'day_of_week' => ['nullable', 'string', 'max:16'],
            'start_time' => ['nullable'],
            'recurring' => ['boolean'],
            'date' => ['nullable', 'date'],
        ]);

        $schedule->update($data);

        return back()->with('status', 'Schedule updated');
    }

    public function destroy(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);
        $schedule->delete();
        return back()->with('status', 'Schedule deleted');
    }

    public function complete(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        abort_unless($this->effectiveRole($request) === 'teacher', 403);
        abort_unless((int) $schedule->teacher_id === (int) $user->id, 403);
        $schedule->update(['status' => 'completed']);
        return back()->with('status', 'Marked completed');
    }
}
