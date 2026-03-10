<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Method Not Allowed';
  exit;
}
$root = __DIR__;
$storeDir = $root . DIRECTORY_SEPARATOR . 'storage';
if (!is_dir($storeDir)) {
  @mkdir($storeDir, 0775, true);
}
$uploadsDir = $root . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'photos';
if (!is_dir($uploadsDir)) {
  @mkdir($uploadsDir, 0775, true);
}
$docsDir = $root . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'docs';
if (!is_dir($docsDir)) {
  @mkdir($docsDir, 0775, true);
}
function upfile($field, $destDir) {
  if (!isset($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) return null;
  $name = basename($_FILES[$field]['name']);
  $ext = pathinfo($name, PATHINFO_EXTENSION);
  $safe = preg_replace('/[^a-zA-Z0-9_\.-]/','_', pathinfo($name, PATHINFO_FILENAME));
  $target = $destDir . DIRECTORY_SEPARATOR . time() . '_' . $safe . ($ext ? '.' . $ext : '');
  if (move_uploaded_file($_FILES[$field]['tmp_name'], $target)) {
    $rel = str_replace($root, '', $target);
    $rel = str_replace('\\', '/', $rel);
    return $rel;
  }
  return null;
}
$photoPath = upfile('photo', $uploadsDir);
$certPath = upfile('certification', $docsDir);
$payload = [
  'id' => bin2hex(random_bytes(8)),
  'fullName' => isset($_POST['fullName']) ? trim($_POST['fullName']) : '',
  'email' => isset($_POST['email']) ? trim($_POST['email']) : '',
  'phone' => isset($_POST['phone']) ? trim($_POST['phone']) : '',
  'photo' => $photoPath,
  'teachingSubjects' => isset($_POST['teachingSubjects']) ? $_POST['teachingSubjects'] : '',
  'educationLevel' => isset($_POST['educationLevel']) ? $_POST['educationLevel'] : '',
  'educationField' => isset($_POST['educationField']) ? $_POST['educationField'] : '',
  'certification' => $certPath,
  'about' => isset($_POST['about']) ? trim($_POST['about']) : '',
  'videoLink' => isset($_POST['videoLink']) ? trim($_POST['videoLink']) : '',
  'availability' => isset($_POST['availability']) ? $_POST['availability'] : '',
  'hourlyRate' => isset($_POST['hourlyRate']) ? $_POST['hourlyRate'] : '',
  'agreeTerms' => isset($_POST['agreeTerms']) ? true : false,
  'status' => 'pending',
  'submitted_at' => date('c')
];
$file = $storeDir . DIRECTORY_SEPARATOR . 'tutors_pending.json';
$list = [];
if (is_file($file)) {
  $list = json_decode(file_get_contents($file), true) ?: [];
}
$list[] = $payload;
file_put_contents($file, json_encode($list, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission Received</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="bg-white rounded-lg shadow p-8 max-w-lg w-full text-center">
      <img src="/images/logo.png" class="mx-auto w-16 h-16 mb-3" alt="logo">
      <h1 class="text-2xl font-bold mb-2">Tutor Application Submitted</h1>
      <p class="text-gray-700 mb-4">Thank you, <?php echo htmlspecialchars($payload['fullName'] ?: 'Tutor'); ?>. Your profile is under review.</p>
      <div class="text-sm text-gray-600 mb-6">
        <p>We sent your details for internal review. You will be contacted via <?php echo htmlspecialchars($payload['email']); ?>.</p>
      </div>
      <a href="/index.html" class="inline-block bg-blue-600 text-white px-5 py-2 rounded">Return Home</a>
    </div>
  </div>
</body>
</html>
