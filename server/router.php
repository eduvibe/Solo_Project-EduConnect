<?php
$base = dirname(__DIR__);
$public = $base . DIRECTORY_SEPARATOR . 'public';

$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$uriPath = rawurldecode($uriPath);

if ($uriPath === '' || $uriPath === '/') {
  $target = $public . DIRECTORY_SEPARATOR . 'index.html';
  header('Content-Type: text/html; charset=utf-8');
  readfile($target);
  return true;
}

if (str_starts_with($uriPath, '/server') || str_starts_with($uriPath, '/.git')) {
  http_response_code(404);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Not Found';
  return true;
}

$candidate = $public . str_replace('/', DIRECTORY_SEPARATOR, $uriPath);
if (is_dir($candidate)) {
  $candidate = rtrim($candidate, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'index.php';
}

if (is_file($candidate)) {
  if (str_ends_with(strtolower($candidate), '.php')) {
    require $candidate;
    return true;
  }

  $ext = strtolower(pathinfo($candidate, PATHINFO_EXTENSION));
  $types = [
    'css' => 'text/css; charset=utf-8',
    'js' => 'application/javascript; charset=utf-8',
    'html' => 'text/html; charset=utf-8',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'webp' => 'image/webp',
    'pdf' => 'application/pdf',
    'mp4' => 'video/mp4'
  ];
  if (isset($types[$ext])) {
    header('Content-Type: ' . $types[$ext]);
  }
  readfile($candidate);
  return true;
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Not Found';
return true;

