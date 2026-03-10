<?php

namespace App\Support;

class RoleDashboard
{
    public static function path(?string $role): string
    {
        $role = strtolower((string) $role);

        return match ($role) {
            'superadmin' => '/dashboard/superadmin',
            'admin' => '/dashboard/admin',
            'teacher' => '/dashboard/teacher',
            default => '/dashboard/parent',
        };
    }
}

