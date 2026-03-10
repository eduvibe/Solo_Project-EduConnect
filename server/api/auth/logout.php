<?php
header('Content-Type: application/json; charset=utf-8');
$paths = require __DIR__ . '/../../bootstrap.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_save_path($paths['sessions']);
  session_start();
}

$_SESSION = [];
if (ini_get('session.use_cookies')) {
  $params = session_get_cookie_params();
  setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}

session_destroy();
echo json_encode(['success' => true]);
