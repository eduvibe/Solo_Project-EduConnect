<?php
header('Content-Type: application/json; charset=utf-8');
$paths = require __DIR__ . '/../../bootstrap.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_save_path($paths['sessions']);
  session_start();
}

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

$name = isset($data['fullName']) ? trim($data['fullName']) : '';
$email = isset($data['email']) ? strtolower(trim($data['email'])) : '';
$password = isset($data['password']) ? $data['password'] : '';
$requestedRole = isset($data['role']) ? strtolower(trim((string)$data['role'])) : '';

if ($name === '' || $email === '' || $password === '') {
  http_response_code(422);
  echo json_encode(['error' => 'missing fields']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['error' => 'invalid email']);
  exit;
}

$storeDir = $paths['storage'];
if (!is_dir($storeDir)) {
  @mkdir($storeDir, 0775, true);
}

$usersFile = $storeDir . DIRECTORY_SEPARATOR . 'users.json';
$users = [];
if (is_file($usersFile)) {
  $rawUsers = file_get_contents($usersFile);
  $users = json_decode($rawUsers, true) ?: [];
}

foreach ($users as $u) {
  if (isset($u['email']) && strtolower($u['email']) === $email) {
    http_response_code(409);
    echo json_encode(['error' => 'email exists']);
    exit;
  }
}

$role = $requestedRole === 'teacher' ? 'teacher' : 'parent';

$users[] = [
  'id' => bin2hex(random_bytes(8)),
  'name' => $name,
  'email' => $email,
  'password_hash' => password_hash($password, PASSWORD_BCRYPT),
  'role' => $role,
  'created_at' => date('c')
];

file_put_contents($usersFile, json_encode($users, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
$_SESSION['user'] = ['id' => $users[count($users) - 1]['id'], 'name' => $name, 'email' => $email, 'role' => $role];
echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
