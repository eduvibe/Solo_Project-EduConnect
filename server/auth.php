<?php

function educonnect_bootstrap_paths(): array
{
  return require __DIR__ . '/bootstrap.php';
}

function educonnect_start_session(array $paths): void
{
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_save_path($paths['sessions']);
  session_start();
}

function educonnect_current_user(): ?array
{
  $paths = educonnect_bootstrap_paths();
  educonnect_start_session($paths);
  return isset($_SESSION['user']) && is_array($_SESSION['user']) ? $_SESSION['user'] : null;
}

function educonnect_require_user(): array
{
  $user = educonnect_current_user();
  if ($user) return $user;

  header('Location: /index.html', true, 302);
  exit;
}

function educonnect_require_role(array $allowedRoles): array
{
  $user = educonnect_require_user();
  $role = isset($user['role']) ? $user['role'] : '';
  if (in_array($role, $allowedRoles, true)) return $user;

  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Forbidden';
  exit;
}

function educonnect_dashboard_path_for_role(string $role): string
{
  $map = [
    'superadmin' => '/dashboard/superadmin/',
    'admin' => '/dashboard/admin/',
    'teacher' => '/dashboard/teacher/',
    'parent' => '/dashboard/parent/'
  ];
  return isset($map[$role]) ? $map[$role] : $map['parent'];
}

