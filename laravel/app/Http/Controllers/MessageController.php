<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\SimpleNotification;
use App\Models\Agreement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $messages = [];
        $recipients = [];
        $role = (string) $user->role;

        if (Schema::hasTable('messages')) {
            $messages = Message::query()
                ->where(function ($q) use ($user) {
                    $q->where('from_user_id', $user->id)
                      ->orWhere('to_user_id', $user->id);
                })
                ->with(['from:id,name', 'to:id,name'])
                ->orderByDesc('created_at')
                ->take(50)
                ->get();
        }

        if (Schema::hasTable('agreements')) {
            if ($role === 'teacher') {
                $recipients = Agreement::query()
                    ->where('teacher_id', $user->id)
                    ->where('status', 'signed')
                    ->with('parent:id,name,email')
                    ->get()
                    ->pluck('parent')
                    ->unique('id')
                    ->values();
            } elseif ($role === 'parent') {
                $recipients = Agreement::query()
                    ->where('parent_id', $user->id)
                    ->where('status', 'signed')
                    ->with('teacher:id,name,email')
                    ->get()
                    ->pluck('teacher')
                    ->unique('id')
                    ->values();
            }
        }

        return Inertia::render('Dashboards/Messages', [
            'messages' => $messages,
            'recipients' => $recipients,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'to_user_id' => ['required', 'integer'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $to = User::query()->findOrFail($data['to_user_id']);

        // Only allow messaging if a signed agreement exists between the two accounts.
        if (Schema::hasTable('agreements')) {
            $hasAgreement = Agreement::query()
                ->where(function ($q) use ($user, $to) {
                    $q->where('teacher_id', $user->id)->where('parent_id', $to->id);
                })
                ->orWhere(function ($q) use ($user, $to) {
                    $q->where('teacher_id', $to->id)->where('parent_id', $user->id);
                })
                ->where('status', 'signed')
                ->exists();

            abort_unless($hasAgreement, 403, 'Messaging is allowed only for signed agreements.');
        }

        $message = Message::create([
            'from_user_id' => $user->id,
            'to_user_id' => $to->id,
            'body' => $data['body'],
        ]);

        SimpleNotification::create([
            'user_id' => $to->id,
            'type' => 'message',
            'data' => ['from' => $user->name, 'id' => $message->id],
        ]);

        return back()->with('status', 'Message sent');
    }
}
