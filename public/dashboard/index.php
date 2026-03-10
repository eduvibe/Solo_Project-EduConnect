<?php
require_once __DIR__ . '/../../server/auth.php';

$user = educonnect_require_user();
$role = isset($user['role']) ? (string)$user['role'] : 'parent';
$target = educonnect_dashboard_path_for_role($role);

header('Location: ' . $target, true, 302);
exit;

