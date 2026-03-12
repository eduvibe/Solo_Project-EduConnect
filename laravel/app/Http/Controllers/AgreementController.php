<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AgreementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = (string) $user->role;
        $agreements = [];

        if (Schema::hasTable('agreements')) {
            if ($role === 'teacher') {
                $agreements = Agreement::query()
                    ->where('teacher_id', $user->id)
                    ->with('parent:id,name')
                    ->orderByDesc('created_at')
                    ->get();
            } elseif ($role === 'parent') {
                $agreements = Agreement::query()
                    ->where('parent_id', $user->id)
                    ->with('teacher:id,name')
                    ->orderByDesc('created_at')
                    ->get();
            }
        }

        return Inertia::render('Dashboards/Agreements', [
            'role' => $role,
            'agreements' => $agreements,
        ]);
    }
}

