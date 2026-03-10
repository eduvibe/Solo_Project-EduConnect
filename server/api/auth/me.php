<?php
header('Content-Type: application/json; charset=utf-8');
$paths = require __DIR__ . '/../../bootstrap.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_save_path($paths['sessions']);
  session_start();
}

if (isset($_SESSION['user'])) {
  echo json_encode(['authenticated' => true, 'user' => $_SESSION['user']]);
} else {
  echo json_encode(['authenticated' => false]);
}
