<?php
$basePath = dirname(__DIR__);
$publicPath = $basePath . DIRECTORY_SEPARATOR . 'public';
$storagePath = $basePath . DIRECTORY_SEPARATOR . 'storage';
$sessionsPath = $storagePath . DIRECTORY_SEPARATOR . 'sessions';

if (!is_dir($storagePath)) {
  @mkdir($storagePath, 0775, true);
}
if (!is_dir($sessionsPath)) {
  @mkdir($sessionsPath, 0775, true);
}

return [
  'base' => $basePath,
  'public' => $publicPath,
  'storage' => $storagePath,
  'sessions' => $sessionsPath
];
