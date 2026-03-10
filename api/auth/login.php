<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'method not allowed']);
  exit;
}
$raw = file_get_contents('php://input');
$data = [];
$ct = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($ct, 'application/json') !== false && $raw) {
  $data = json_decode($raw, true) ?: [];
} else {
  $data = $_POST;
}
$email = isset($data['email']) ? strtolower(trim($data['email'])) : '';
$password = isset($data['password']) ? $data['password'] : '';
if ($email === '' || $password === '') {
  http_response_code(422);
  echo json_encode(['error' => 'missing fields']);
  exit;
}
$root = dirname(__DIR__, 2);
$usersFile = $root . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'users.json';
if (!is_file($usersFile)) {
  http_response_code(401);
  echo json_encode(['error' => 'invalid credentials']);
  exit;
}
$users = json_decode(file_get_contents($usersFile), true) ?: [];
$found = null;
foreach ($users as $u) {
  if (isset($u['email']) && strtolower($u['email']) === $email) {
    $found = $u;
    break;
  }
}
if (!$found || !isset($found['password_hash']) || !password_verify($password, $found['password_hash'])) {
  http_response_code(401);
  echo json_encode(['error' => 'invalid credentials']);
  exit;
}
$_SESSION['user'] = ['id' => $found['id'], 'name' => $found['name'], 'email' => $found['email'], 'role' => $found['role']];
echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
